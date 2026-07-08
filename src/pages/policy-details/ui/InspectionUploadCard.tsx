import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { Alert, Button, Card, Image, List, Space, Spin, Tag, Typography, Upload } from 'antd'
import imageCompression from 'browser-image-compression'
import { useMemo, useState } from 'react'

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
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1600,
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
      setError('Failed to compress selected images.')
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
      setError('Inspection verification failed.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card title="Vehicle inspection">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Upload
          multiple
          accept="image/*"
          fileList={uploadFileList}
          showUploadList={false}
          beforeUpload={(file, fileList) => {
            void handleSelectFiles(fileList as File[])
            return Upload.LIST_IGNORE
          }}
        >
          <Button icon={<UploadOutlined />} loading={isCompressing}>
            Upload inspection photos
          </Button>
        </Upload>

        {isCompressing && (
          <Space>
            <Spin size="small" />
            <Text type="secondary">Compressing images...</Text>
          </Space>
        )}

        {error && <Alert message={error} type="error" showIcon />}

        {photos.length > 0 && (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
            dataSource={photos}
            renderItem={(photo) => (
              <List.Item>
                <Card
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
                  <Space direction="vertical" size={4}>
                    <Text strong ellipsis>
                      {photo.file.name}
                    </Text>
                    <Text type="secondary">
                      {formatFileSize(photo.originalSize)} →{' '}
                      {formatFileSize(photo.compressedSize)}
                    </Text>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        )}

        <Button
          type="primary"
          disabled={photos.length === 0}
          loading={isVerifying}
          onClick={handleVerify}
        >
          Send for verification
        </Button>

        {result && (
          <Alert
            type={result.status === 'APPROVED' ? 'success' : result.status === 'REJECTED' ? 'error' : 'warning'}
            showIcon
            message={
              <Space>
                <span>Verification result</span>
                <Tag color={getResultColor(result.status)}>{result.status}</Tag>
                <Text>{result.confidence}% confidence</Text>
              </Space>
            }
            description={
              result.issues.length > 0 ? result.issues.join(', ') : 'No issues detected.'
            }
          />
        )}
      </Space>
    </Card>
  )
}