import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Header from '../../components/Header'
import { Link } from 'react-router-dom'
import { Table, Button, Icon, Card, Loading, Tag, Message } from 'element-react'
import { getAllUsers, removeUser } from '../../actions/admin'
import { getAllTags } from '../../actions/tag'
import moment from 'moment'

class Admin extends Component {
  constructor() {
    super()

    this.state = {
      filteredUsers: [],
      actionsRange: 5,
      tagColumns: [
        { type: 'index' },
        {
          label: 'Название',
          render: function(data) {
            return (
              <span>
                <span>{data.title}</span>
              </span>
            )
          }
        },
        {
          label: 'Картинка',
          render: function(data) {
            if (data.cover) {
              const tagImage = require(`../../uploads/tags/${data.cover}`)

              if (tagImage !== undefined || tagImage !== null) {
                return (
                  <span>
                    <span>
                      <img
                        src={tagImage}
                        alt="cover"
                        style={{
                          width: '25px',
                          display: 'block'
                        }}
                      />
                    </span>
                  </span>
                )
              }
            }
          }
        },
        {
          label: 'Действия',
          width: 150,
          render: (row, col, index) => {
            return (
              <span>
                <Link
                  to={`/admin/tag/edit/${row.title}`}
                  className="table-controller-btn"
                  onClick={() => this.editTag(row, index)}
                >
                  <Icon name="edit" />
                </Link>

                <Button type="danger" size="small">
                  <Icon name="delete" />
                </Button>
              </span>
            )
          }
        }
      ],
      userColumns: [
        {
          type: 'index'
        },
        {
          label: 'Создан в',
          prop: 'date',
          render: function(data) {
            return (
              <span>
                <span>{moment(data.date).format('YYYY-MM-DD HH:mm')}</span>
              </span>
            )
          }
        },
        {
          label: 'Имя',
          prop: 'name',
          render: function(data) {
            return <span>{data.name}</span>
          }
        },
        {
          label: 'ID',
          prop: 'id',
          render: function(data) {
            return <span>{data._id}</span>
          }
        },
        {
          label: 'Действия',
          render: (row, col, index) => {
            return (
              <span>
                <Link
                  to={`/admin/user/${row.name}`}
                  className="table-controller-btn"
                >
                  <Icon name="edit" />
                </Link>

                <Button
                  type="danger"
                  size="small"
                  onClick={() => this.destroyUser(row, index)}
                >
                  <Icon name="delete" />
                </Button>
              </span>
            )
          }
        }
      ]
    }
  }

  destroyUser = (row, index) => {
    // TODO finish this shit
    let remove = window.confirm(
      `Вы уверены что хотите удалить пользователя ${row.name}?`
    )

    if (remove) {
      if (row._id === localStorage.getItem('_id')) {
        return Message.error('Вы не можете удалить сами себя')
      }

      this.props.removeUser(row._id)
    }
  }

  editTag = (row, index) => {
    console.log(row, index)
  }

  filteredItems = e => {
    let name = e.target.value

    let filtered = this.props.users
      .filter(el => {
        return !!~el.name.toLowerCase().indexOf(name.toLowerCase())
      })
      .map(el => el)

    this.setState({
      filteredUsers: filtered
    })
  }

  componentDidMount() {
    this.props.getAllTags()
    this.props.getAllUsers()
  }

  setRange = value => {
    this.setState({ actionsRange: value })
  }

  render() {
    const { userColumns, tagColumns, filteredUsers, actionsRange } = this.state
    const { users, tags, pendingUsers, pendingTags } = this.props
    const { filteredItems, setRange } = this
    const latestActions = JSON.parse(localStorage.getItem('latestActions'))

    let usersData

    if (filteredUsers.length) {
      usersData = filteredUsers
    } else {
      usersData = users
    }

    return (
      <DocumentTitle title="GeekAsks –– Админ панель">
        <div id="adminpage">
          <Header />

          <div className="container page">
            <div className="row">
              <div className="col-xs-12">
                <h3 className="page-title">Администрирование сайтом</h3>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-9 col-xs-12">
                <div className="table-header">
                  <p className="table-header__title">Пользователи</p>
                  <div className="el-input table-header__search">
                    <i className="el-input__icon el-icon-search" />
                    <input
                      type="text"
                      onChange={filteredItems}
                      className="el-input__inner"
                      placeholder="Имя"
                    />
                  </div>
                </div>
                <Loading loading={pendingUsers}>
                  <Table
                    className="users-table"
                    style={{ width: '100%' }}
                    columns={userColumns}
                    data={usersData}
                    emptyText="Пусто..."
                    border={true}
                    maxHeight={200}
                  />
                </Loading>

                <div className="table-header">
                  <p className="table-header__title">Теги</p>

                  <div className="table-header__secondary">
                    <Link
                      to="/admin/tag/new"
                      className="el-button el-button--success"
                    >
                      <Icon name="plus" />
                    </Link>
                  </div>
                </div>
                <Loading loading={pendingTags}>
                  <Table
                    className="tags-table"
                    style={{ width: '100%' }}
                    columns={tagColumns}
                    data={tags}
                    emptyText="Пусто..."
                    border={true}
                    maxHeight={200}
                  />
                </Loading>
              </div>
              <div className="col-sm-3 col-xs-12">
                <div className="recent-actions">
                  <Card
                    className="recent-actions__box"
                    header={
                      <div className="clearfix">
                        <p className="recent-actions__title">
                          Недавние действия
                        </p>

                        {latestActions && (
                          <p className="recent-actions__range-box">
                            <span className="recent-actions__range-value">
                              {actionsRange}/{latestActions.length}
                            </span>
                            <input
                              type="range"
                              className="recent-actions__range"
                              step="1"
                              min="1"
                              max={latestActions.length}
                              value={actionsRange}
                              onChange={e => setRange(e.target.value)}
                            />
                          </p>
                        )}
                      </div>
                    }
                  >
                    {latestActions &&
                      latestActions
                        .slice(-actionsRange)
                        .map((el, index, arr) => {
                          return (
                            <Tag className="text item" key={index}>
                              {el.action}
                            </Tag>
                          )
                        })}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

// TODO progress bar for uploads https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Monitoring_progress
// TODO get tags by its names
// '_id': { $in: [
//   mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
//   mongoose.Types.ObjectId('4ed3f117a844e0471100000d'),
//   mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
// ]}
// }, function(err, docs){
//   console.log(docs);
// })

function mapStateToProps(state) {
  return {
    users: state.admin.get('users'),
    pendingUsers: state.admin.get('pendingUsers'),
    pendingTags: state.tag.get('pendingTags'),
    tags: state.tag.get('tags'),
    accessLevel: state.user.get('accessLevel')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllUsers() {
      dispatch(getAllUsers())
    },
    getAllTags() {
      dispatch(getAllTags())
    },
    removeUser(id) {
      dispatch(removeUser(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
