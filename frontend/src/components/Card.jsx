export default function Card({
  children,
  title,
  subtitle,
  action,
  hoverable = false,
  className = '',
  bodyClassName = '',
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 ${hoverable ? 'hover:shadow-md hover:border-slate-300' : ''} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
