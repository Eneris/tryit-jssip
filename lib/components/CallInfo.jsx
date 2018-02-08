import React, {Component} from 'react'
import PropTypes from 'prop-types'

class CallInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stats: []
    }
  }

  componentDidMount() {
    this.getStats()
    this.id = setInterval(this.getStats.bind(this), this.props.refreshInterval)
  }

  componentWillUnmount() {
    clearInterval(this.id)
  }

  getStats() {
    const self = this
    this.props.connection.getStats(report => {
      let items = []
      report.result().forEach(res => {
        let item = {}
        res.names().forEach(name => item[name] = res.stat(name))
        items.push(item)
      })

      self.setState({stats: items})
    })
  }

  render() {
    const stats = this.state.stats

    return (
      <div style={{position: 'fixed', zIndex: 1000, top: 100, left: 100}}>
        {stats.filter(x => x.transportId && x.transportId.match(/audio/)).map(({
           packetsSent,
           packetsLost,
           googRtt
        }) => (
          <ul>
            <li>{`packetsSent: ${packetsSent}`}</li>,
            <li>{`packetsLost: ${packetsLost}`}</li>
            <li>{`googRtt: ${googRtt}`}</li>
          </ul>
        ))}
      </div>
    )
  }
}

CallInfo.propTypes = {
  connection: PropTypes.object.isRequired,
  refreshInterval: PropTypes.number
}

CallInfo.defaultProps = {
  refreshInterval: 1000
}

export default CallInfo
