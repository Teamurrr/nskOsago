import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { Alert, Button, Card, Image, Space, Spin, Tag, Typography, Upload } from 'antd'
import imageCompression from 'browser-image-compression'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  type InspectionPhotoPayload,
  type InspectionVerificationResult,
  verifyInspection,
} from '../../../entities/policy'

const { Text } = Typography

interface InspectionPhoto {
  id: string
  file: File
  previewUrl: string
  originalSize: number
  compressedSize: number
}

interface InspectionUploadCardProps {
  policyId: string
}

function getResultColor(status: InspectionVerificationResult['status']) {
  if (status === 'APPROVED') {
    return 'green'
  }

  if (status === 'REJECTED') {
    return 'red'
  }

  return 'gold'
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

export function InspectionUploadCard({ policyId }: InspectionUploadCardProps) {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<InspectionPhoto[]>([])
  const [isCompressing, setIsCompressing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<InspectionVerificationResult | null>(null)

  const uploadFileList: UploadFile[] = useMemo(
    () =>
      photos.map((photo) => ({
        uid: photo.id,
        name: photo.file.name,
        status: 'done',
        url: photo.previewUrl,
      })),
    [photos],
  )

  const handleSelectFiles = async (files: File[]) => {
    setError(null)
    setResult(null)
    setIsCompressing(true)

    try {
      const compressedPhotos = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.12,
            maxWidthOrHeight: 900,
            initialQuality: 0.55,
            useWebWorker: true,
          })

          return {
            id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
            file: compressedFile,
            previewUrl: URL.createObjectURL(compressedFile),
            originalSize: file.size,
            compressedSize: compressedFile.size,
          }
        }),
      )

      setPhotos((currentPhotos) => [...currentPhotos, ...compressedPhotos])
    } catch {
      setError(t('pages.inspection.compressionError'))
    } finally {
      setIsCompressing(false)
    }
  }

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((currentPhotos) => {
      const photo = currentPhotos.find((item) => item.id === photoId)

      if (photo) {
        URL.revokeObjectURL(photo.previewUrl)
      }

      return currentPhotos.filter((item) => item.id !== photoId)
    })

    setResult(null)
  }

  const handleVerify = async () => {
    setError(null)
    setResult(null)
    setIsVerifying(true)

    try {
      const payload: InspectionPhotoPayload[] = photos.map((photo) => ({
        name: photo.file.name,
        size: photo.file.size,
        type: photo.file.type,
      }))

      const verificationResult = await verifyInspection(policyId, payload)

      setResult(verificationResult)
    } catch {
      setError(t('pages.inspection.verificationError'))
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card title={t('pages.inspection.title')}>
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Upload
          multiple
          accept="image/*"
          fileList={uploadFileList}
          showUploadList={false}
          beforeUpload={(_, fileList) => {
            void handleSelectFiles(fileList as File[])
            return Upload.LIST_IGNORE
          }}
        >
          <Button icon={<UploadOutlined />} loading={isCompressing}>
            {t('pages.inspection.uploadPhotos')}
          </Button>
        </Upload>

        {isCompressing && (
          <Space>
            <Spin size="small" />
            <Text type="secondary">{t('pages.inspection.compressing')}</Text>
          </Space>
        )}

        {error && <Alert title={error} type="error" showIcon />}

        {photos.length > 0 && (
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            }}
          >
            {photos.map((photo) => (
              <Card
                key={photo.id}
                size="small"
                cover={
                  <Image
                    src={photo.previewUrl}
                    alt={photo.file.name}
                    height={180}
                    style={{ objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button
                    key="remove"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemovePhoto(photo.id)}
                  />,
                ]}
              >
                <Space orientation="vertical" size={4}>
                  <Text strong ellipsis>
                    {photo.file.name}
                  </Text>
                  <Text type="secondary">
                    {formatFileSize(photo.originalSize)} {'->'}{' '}
                    {formatFileSize(photo.compressedSize)}
                  </Text>
                </Space>
              </Card>
            ))}
          </div>
        )}

        <Button
          type="primary"
          disabled={photos.length === 0 || isCompressing}
          loading={isVerifying}
          onClick={handleVerify}
        >
          {isVerifying ? t('pages.inspection.verifying') : t('pages.inspection.sendForVerification')}
        </Button>

        {photos.length === 0 && (
          <Alert
            type="info"
            showIcon
            title={t('pages.inspection.emptyTitle')}
            description={t('pages.inspection.emptyDescription')}
          />
        )}

        {result && (
          <Card size="small" title={t('pages.inspection.verdictTitle')}>
            <Space orientation="vertical" size="small" style={{ width: '100%' }}>
              <Space wrap>
                <Tag color={getResultColor(result.status)}>
                  {t(`pages.inspection.statuses.${result.status}`)}
                </Tag>
                <Text strong>
                  {t('pages.inspection.confidence', { value: result.confidence })}
                </Text>
              </Space>

              {result.issues.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {result.issues.map((issue) => (
                    <li key={issue}>
                      {t(`pages.inspection.issues.${issue}`, { defaultValue: issue })}
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">{t('pages.inspection.noIssues')}</Text>
              )}
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  )
}
