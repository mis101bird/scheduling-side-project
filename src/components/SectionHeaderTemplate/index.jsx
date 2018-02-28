import React from 'react'
import { Breadcrumb } from 'antd'
import './index.less'

class SectionHeaderTemplate extends React.Component {
  render() {
    const { breadcrumbDataSource, title } = this.props
    return (
      <div className='section-header-template'>
        {
          breadcrumbDataSource &&
          <Breadcrumb>
            {breadcrumbDataSource.map((item) => {
              const itemProps = {
                key: item.title,
                href: item.href,
              }
              !itemProps.href && delete itemProps.href
              return (
                <Breadcrumb.Item {...itemProps}>
                  {item.title}
                </Breadcrumb.Item>
              )
            })}
          </Breadcrumb>
        }
        <h1>{title}</h1>
      </div>
    )
  }
}

export default SectionHeaderTemplate
