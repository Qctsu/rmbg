import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { Circle as CircleProgress } from 'rc-progress'
import rmbg from '@rmbg/browser'
import {
  type RMBGModel,
  createBriaaiModel,
  createModnetModel,
  createSiluetaModel,
  createU2netpModel
} from '@rmbg/browser/models'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import { CirclePicker } from 'react-color'

import CloseOutlinedIcon from '../../icons/outlined/close.svg'
import CompareOutlinedIcon from '../../icons/outlined/compare.svg'
import { createImageWithBackground } from '../../utils/image'

const isDev = process.env.NODE_ENV === 'development'

interface ModelOption {
  label: string
  value: RMBGModel
}

const models: ModelOption[] = [
  {
    label: 'U2netp',
    value: createU2netpModel(
      isDev ? '/node_modules/@rmbg/model-u2netp/' : undefined
    )
  },
  {
    label: 'Modnet',
    value: createModnetModel(
      isDev ? '/node_modules/@rmbg/model-modnet/' : undefined
    )
  },
  {
    label: 'Briaai',
    value: createBriaaiModel(
      isDev ? '/node_modules/@rmbg/model-briaai/' : undefined
    )
  },
  {
    label: 'Silueta',
    value: createSiluetaModel(
      isDev ? '/node_modules/@rmbg/model-silueta/' : undefined
    )
  }
]

const images = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1024',
  'https://images.unsplash.com/photo-1623006772851-a8bf2c47d304?q=80&w=1024',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1024',
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?q=80&w=1024',
  'https://images.unsplash.com/photo-1620917669809-1af0497965de?q=80&w=1024'
]

export default function Playground(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  const [model, setModel] = useState<ModelOption>(models[0])
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [caches, setCaches] = useState<Record<string, string>>({})
  const [result, setResult] = useState('')
  const [background, setBackground] = useState('transparent')
  const [comparing, setComparing] = useState(false)

  const reset = useCallback(() => {
    setSource('')
    setLoading(false)
    setProgress(0)
    setDownloading(false)
    setCaches({})
    setResult('')
    setBackground('transparent')
    setComparing(false)
  }, [])

  const process = useCallback(
    (source: string, model: RMBGModel) => {
      setLoading(true)
      setProgress(0)
      setDownloading(true)
      rmbg(source, {
        model,
        onnx: {
          publicPath: isDev ? '/node_modules/onnxruntime-web/dist/' : undefined
        },
        runtime: isDev
          ? '/node_modules/@rmbg/browser/dist/rmbg-runtime.iife.js'
          : undefined,
        onProgress(progress, download) {
          setProgress(progress * 100)
          if (download >= 1) {
            setDownloading(false)
          }
        }
      })
        .then((image) => {
          setLoading(false)
          setProgress(0)
          setDownloading(false)
          setCaches((caches) => ({
            ...caches,
            [model.name]: URL.createObjectURL(image)
          }))
          setResult(URL.createObjectURL(image))
        })
        .catch(() => {
          reset()
        })
    },
    [reset]
  )

  useEffect(() => {
    if (source && model) {
      if (result) {
        const cache = caches[model.value.name]
        if (cache) {
          setResult(cache)
        } else {
          process(source, model.value)
        }
      } else {
        process(source, model.value)
      }
    }
  }, [source, model, result, process])

  return (
    <Layout
      title="Remove Image Backgrounds for Free – Locally and with Open Source via rmbg.fun."
      description="Remove image backgrounds for free, locally and securely, using the open-source tool rmbg.fun, no internet connection required."
    >
      <div className="container my-20">
        <header className="mb-6 text-center md:mb-12">
          <Heading
            as="h1"
            className="mb-4 font-bold text-4xl md:mb-6 md:text-6xl"
          >
            Background Remover
          </Heading>
          <p className="text-base text-[--ifm-color-secondary-darkest] md:text-lg">
            Remove image backgrounds at no cost and substitute them with a
            variety of backgrounds you prefer.
          </p>
        </header>
        <main>
          {result ? (
            <div
              className={clsx(
                'flex justify-between items-center mx-auto my-4 max-w-screen-sm',
                {
                  'pointer-events-none opacity-60': loading
                }
              )}
            >
              <CirclePicker
                colors={[
                  'transparent',
                  '#000000',
                  '#e91e63',
                  '#2196f3',
                  '#4caf50'
                ]}
                onChange={(color) => {
                  setBackground(color.hex)
                }}
              />
              <CompareOutlinedIcon
                className="fill-gray-600 cursor-pointer hover:fill-gray-900"
                onPointerDown={() => {
                  setComparing(true)
                }}
                onPointerUp={() => {
                  setComparing(false)
                }}
                onPointerOut={() => {
                  setComparing(false)
                }}
                onPointerCancel={() => {
                  setComparing(false)
                }}
              />
            </div>
          ) : null}

          <div className="relative mx-auto max-w-screen-sm aspect-[4/3] border border-solid border-gray-100 rounded-2xl shadow-lg overflow-hidden">
            {!source ? (
              <div
                className="flex flex-col justify-center items-center w-full h-full"
                style={{
                  backgroundColor: 'white',
                  backgroundImage:
                    'repeating-conic-gradient(#f5f2fa 0 25%,#0000 0 50%)',
                  backgroundSize: '28px 28px'
                }}
              >
                <button className="button button--primary button--lg relative">
                  Select an Image
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const sourceURL = URL.createObjectURL(file)
                        setSource(sourceURL)
                      }
                    }}
                  />
                </button>
                <div
                  className={clsx('mt-6 text-center', {
                    'pointer-events-none opacity-60': loading
                  })}
                >
                  <div className="text-sm text-neutral-500">
                    No picture on hand? Try with one of these
                  </div>
                  <div className="my-2 flex justify-center items-center">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        className="mr-1 w-14 h-14 rounded object-cover cursor-pointer last:mr-0 hover:opacity-85"
                        src={image}
                        alt=""
                        onClick={() => {
                          setSource(image)
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-center items-center text-xs text-neutral-500">
                  <label>Model: </label>
                  <select
                    className="relative z-10 width-full h-[32px] text-xs text-neutral-500 border-none bg-transparent"
                    value={model.value.name}
                    onChange={(e) => {
                      setModel(
                        models.find((m) => m.value.name === e.target.value)!
                      )
                    }}
                  >
                    {models.map((model) => (
                      <option key={model.value.name} value={model.value.name}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            {source && (!result || comparing) ? (
              <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-neutral-100">
                <img
                  className="block w-auto h-full object-contain"
                  src={source}
                />
              </div>
            ) : null}

            {result && !comparing ? (
              <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-gray-100">
                <img
                  className="block w-auto h-full object-contain"
                  style={
                    background === 'transparent'
                      ? {
                          backgroundImage:
                            'repeating-conic-gradient(#f5f2fa 0 25%, #0003 0 50%)',
                          backgroundSize: '28px 28px'
                        }
                      : { backgroundColor: background }
                  }
                  src={result}
                />
              </div>
            ) : null}

            {result ? (
              <div
                className="absolute top-2 right-2 flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
                onClick={reset}
              >
                <CloseOutlinedIcon className="w-4 h-4" />
              </div>
            ) : null}

            {loading ? (
              <div className="absolute flex flex-col justify-center items-center inset-0 w-full h-full bg-[rgba(0,0,0,0.5)]">
                <CircleProgress
                  className="w-8 h-8"
                  percent={progress}
                  strokeWidth={6}
                  strokeColor="#2e8555"
                  trailWidth={6}
                />
                <div className="mt-2 text-white text-xs">
                  {downloading
                    ? 'Downloading the ai model...'
                    : 'Image processing...'}
                </div>
              </div>
            ) : null}
          </div>

          <div
            className={clsx(
              'flex justify-center items-center mx-auto my-4 max-w-screen-sm',
              {
                'pointer-events-none opacity-60': loading
              }
            )}
          >
            {result ? (
              <button
                className="button button--primary relative"
                onClick={() => {
                  const a = document.createElement('a')
                  if (background === 'transparent') {
                    a.href = result
                    a.download = 'background-removed.png'
                    a.click()
                  } else {
                    createImageWithBackground(result, background)
                      .then((url) => {
                        a.href = url
                        a.download = 'background-removed.png'
                        a.click()
                      })
                      .catch(() => {})
                  }
                }}
              >
                Download
              </button>
            ) : null}
          </div>
        </main>
      </div>
    </Layout>
  )
}
