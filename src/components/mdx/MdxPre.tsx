'use client'

import CopyButton from './CopyButton'

type MdxPreProps = React.ComponentPropsWithoutRef<'pre'> & {
  'data-title'?: string
  'data-language'?: string
  'data-code'?: string
}

export function MdxPre({
  children,
  'data-title': title,
  'data-language': language,
  'data-code': code,
  ...rest
}: MdxPreProps) {
  return (
    <div className="code-block group">
      {title ? (
        <span className="code-title">{title}</span>
      ) : language ? (
        <span className="code-lang">{language}</span>
      ) : null}

      {/* Copy button */}
      {code && (
        <CopyButton
          className="hidden opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100! sm:block"
          value={code}
        />
      )}

      <div className="code-wrapper">
        <pre {...rest}>{children}</pre>
      </div>
    </div>
  )
}

export default MdxPre
