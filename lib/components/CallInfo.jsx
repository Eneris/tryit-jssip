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
    console.log('BLA', stats)

    return (
      <div className='no-remote-video-info'>
        {stats.filter(x => x.candidateType === 'serverreflexive').map(({ipAddress, networkType}) => [
          <div className='message'><strong>ipAddress</strong>: {ipAddress}</div>,
          <div className='message'><strong>networkType</strong>: {networkType}</div>
        ])}
        {stats.filter(x => x.transportId && x.transportId.match(/audio/)).map(({
           googCodecName,
           packetsLost,
           googRtt,
           googResidualEchoLikelihood,
           googJitterReceived
        }) => [
          <div className='message'><strong>CodecName</strong>: {googCodecName}</div>,
          <div className='message'><strong>packetsLost</strong>: {packetsLost}</div>,
          <div className='message'><strong>RTT</strong>: {googRtt}</div>,
          <div className='message'><strong>Echo Likelihood</strong>: {googResidualEchoLikelihood}</div>,
          <div className='message'><strong>JitterReceived</strong>: {googJitterReceived}</div>
        ])}
        {stats.filter(x => x.googChannelId && x.googChannelId.match(/audio/)).map(({
           bytesReceived,
           bytesSent,
        }) => [
          <div className='message'><strong>bytesReceived</strong>: {parseInt(parseInt(bytesReceived)/1024)} KB</div>,
          <div className='message'><strong>bytesSent</strong>: {parseInt(parseInt(bytesSent)/1024)} KB</div>
        ])}
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
