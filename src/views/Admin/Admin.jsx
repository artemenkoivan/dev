import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Header from '../../components/Header'
import { Link } from 'react-router-dom'
import {
  Table,
  Button,
  Icon,
  Card,
  Loading,
  Tag
} from 'element-react'
import { getAllUsers } from '../../actions/admin'
import { getAllTags } from '../../actions/tag'
import moment from 'moment'

class Admin extends Component {
  constructor() {
    super()

    this.state = {
      filteredUsers: [],
      tagColumns: [
        { type: 'index' },
        {
          label: 'Название',
          render: function (data) {
            return (
              <span>
                <span>{ data.title }</span>
              </span>
            )
          }
        },
        {
          label: 'Картинка',
          render: function (data) {
            return (
              <span>
                <span>
                  <img src={ require(`../../uploads/tags/${data.cover}`) }
                       alt="cover"
                       style={{
                         width: '25px',
                         display: 'block'
                       }}/>
                </span>
              </span>
            )
          }
        },
        {
          label: 'Действия',
          width: 150,
          render: (row, col, index) => {
            return (
              <span>
                <Link to={ `/admin/tag/edit/${row.title}` }
                      className="table-controller-btn"
                      onClick={ () => this.editTag(row, index) }>
                  <Icon name="edit"/>
                </Link>

                <Button type="danger" size="small">
                  <Icon name="delete"/>
                </Button>
              </span>
            )
          }
        }
      ],
      userColumns: [
        { type: 'index' },
        {
          label: 'Создан в',
          prop: 'date',
          render: function(data) {
            return (
              <span>
                <span>{ moment(data.date).format('YYYY-MM-DD HH:mm') }</span>
              </span>
            )
          }
        },
        {
          label: 'Имя',
          prop: 'name',
          render: function(data) {
            return <span>{ data.name }</span>
          }
        },
        {
          label: 'ID',
          prop: 'id',
          render: function(data) {
            return <span>{ data._id }</span>
          }
        },
        {
          label: 'Действия',
          render: (row, col, index) => {
            return (
              <span>
                <Link to={ `/admin/user/edit/${row.name}` }
                      className="table-controller-btn"
                      onClick={ () => this.editUser(row, index) }>
                  <Icon name="edit"/>
                </Link>

                <Button type="danger" size="small">
                  <Icon name="delete"/>
                </Button>
              </span>
            )
          }
        }
      ]
    }

  }

  editUser = (row, index) => {
    console.log(row.name, index)
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
    this.props.getAllUsers()
    this.props.getAllTags()
  }

  render() {
    const { userColumns, tagColumns, filteredUsers } = this.state
    const { users, tags, pendingUsers, pendingTags } = this.props
    const { filteredItems } = this

    let usersData;

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
                    <i className="el-input__icon el-icon-search"></i>
                    <input type="text"
                           onChange={ filteredItems }
                           className="el-input__inner"
                           placeholder="Имя"/>
                  </div>
                </div>
                <Loading loading={ pendingUsers }>
                  <Table
                      className="users-table"
                      style={{ width: '100%' }}
                      columns={ userColumns }
                      data={ usersData }
                      emptyText="Пусто..."
                      border={ true }
                      maxHeight={ 200 }
                  />
                </Loading>

                <div className="table-header">
                  <p className="table-header__title">Теги</p>

                  <div className="table-header__secondary">
                    <Link to="/admin/tag/new" className="el-button el-button--success"><Icon name="plus" /></Link>
                  </div>
                </div>
                <Loading loading={ pendingTags }>
                  <Table
                      className="tags-table"
                      style={{ width: '100%' }}
                      columns={ tagColumns }
                      data={ tags }
                      emptyText="Пусто..."
                      border={ true }
                      maxHeight={ 200 }
                  />
                </Loading>
              </div>
              <div className="col-sm-3 col-xs-12">
                <div className="recent-actions">
                  <Card
                      className="recent-actions__box"
                      header={
                        <div className="clearfix">
                          <p className="recent-actions__title">Недавние действия</p>
                        </div>}
                  >
                    <Tag type="danger" className="text item">Пользователь Test2 удален</Tag>
                    <Tag type="success" className="text item">Добавлен тег JavaScript</Tag>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
