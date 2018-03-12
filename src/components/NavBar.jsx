import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Badge } from 'element-react'

class NavBar extends Component {
  render() {
    const { userName, logout, accessLevel, notifications } = this.props

    return (
      <Menu mode="horizontal" className="main-header__navbar">
        <Menu.Item index="1">
          <Link to="/feed">Моя лента</Link>
        </Menu.Item>
        <Menu.SubMenu index="2" title={userName}>
          <Menu.Item index="2-1">
            <Badge value={notifications}>
              <Link to="/notifications">Уведомления</Link>
            </Badge>
          </Menu.Item>
          <Menu.Item index="2-2">
            <Link to={`/user/${userName}`}>Профиль</Link>
          </Menu.Item>
          <Menu.Item index="2-3" className="sub-sub-menu">
            <Link to="/settings">
              <i className="el-icon-setting" />Настройки
            </Link>
          </Menu.Item>
          {accessLevel && (
            <Menu.Item index="2-4">
              <Link to="/admin">
                <i className="el-icon-edit" />Admin
              </Link>
            </Menu.Item>
          )}
          <Menu.Item index={accessLevel ? '2-5' : '2-4'}>
            <a href="" onClick={logout}>
              <i className="el-icon-arrow-left" />Выход
            </a>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }
}

export default NavBar
