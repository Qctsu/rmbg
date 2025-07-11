import clsx from 'clsx'
import AppleIcon from '../icons/AppleIcon'
import ChromeIcon from '../icons/ChromeIcon'
import GithubIcon from '../icons/GithubIcon'
import LinuxIcon from '../icons/LinuxIcon'
import WindowsIcon from '../icons/WindowsIcon'

const resources = [
  {
    name: 'RMBG_0.0.1_x64-setup.exe',
    icon: <WindowsIcon className="text-8xl" />,
    title: 'Windows',
    download:
      'https://github.com/zhbhun/rmbg/releases/download/v0.0.1/RMBG_0.0.1_x64-setup.exe'
  },
  {
    name: 'rmbg_0.0.1_amd64.deb',
    icon: <LinuxIcon className="text-8xl" />,
    title: 'Linux',
    download:
      'https://github.com/zhbhun/rmbg/releases/download/v0.0.1/rmbg_0.0.1_amd64.deb'
  },
  {
    name: 'RMBG_0.0.1_aarch64.dmg.zip',
    icon: <AppleIcon className="text-8xl" />,
    title: 'macOS',
    download:
      'https://github.com/zhbhun/rmbg/releases/download/v0.0.1/RMBG_0.0.1_aarch64.dmg.zip'
  },
  {
    name: 'webapp',
    icon: <ChromeIcon className="text-8xl" />,
    title: 'Web',
    download: '',
    url: 'https://rmbg.fun/playground'
  },
  {
    name: 'more',
    icon: <GithubIcon className="text-8xl" />,
    title: 'More',
    download: '',
    url: 'https://github.com/zhbhun/rmbg/releases/tag/v0.0.1',
    target: '_blank'
  }
]

export interface PlaygroundProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
}

export default function Playground({
  className,
  header,
  ...props
}: PlaygroundProps): JSX.Element {
  return (
    <div
      {...props}
      className={clsx(
        'container flex flex-col items-center justify-center py-10',
        className
      )}
    >
      {header}
      <div className="flex flex-col items-center justify-center gap-20 md:flex-row">
        {resources.map((resource, index) => (
          <a
            key={index}
            className="flex flex-col items-center"
            href={resource.download || resource.url}
            download={resource.download ? resource.name : undefined}
            target={resource.target}
          >
            {resource.icon}
            <div className="mt-4 text-xl">{resource.title}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
