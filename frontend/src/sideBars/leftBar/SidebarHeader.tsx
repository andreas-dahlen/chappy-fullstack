type SidebarHeaderProps = {
  title: string
  action?: React.ReactNode
}

export default function SidebarHeader({
  title,
  action
}: SidebarHeaderProps) {
  return (
    <header className='side-bar-header'>
      <div className='side-bar-header-content'>
        <span>{title}</span>
        {action}
      </div>
    </header>
  )
}