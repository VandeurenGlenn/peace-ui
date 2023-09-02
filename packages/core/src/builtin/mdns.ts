import makeMdns from 'multicast-dns'
import address from 'address';
const devices = {}
const mdns = makeMdns({loopback: false});

mdns.on('response', function(response) {
  console.log(response.answers);
  console.log(response.additionals);
  // handleRespone(response)
  return
  
  const answers = response.answers
  console.log(response);
  let deviceName
  // try getting the name from
  if (answers.length) {
    deviceName = response.answers[0]?.data.includes('.local') ? response.answers[0].data : response.answers[0].name;
  } else if (response.additionals) {

    deviceName = response.additionals[0]?.data.includes('.local') ? response.additionals[0].data : response.additionals[0].name;
  }
  for (const answer of answers) {
    

    if (Array.isArray(answer.data)) {


      console.log({answer});
      devices[deviceName] = {
        
      }
      for (const data of answer.data) {
        console.log(data.toString());
        devices[deviceName] = {
        
        }
      }
    } if (typeof answer.data === 'object') {
console.log('enswer object');

    } else {
      // data = a string so we handle it as a .local device
      devices[deviceName] = answer
      
      mdns.query({
        questions:[{
          name: deviceName,
          type: answer.type
        }]
      })
    }
  }
  for (const additional of response.additionals) {

    if (Array.isArray(additional.data)) {
      devices[deviceName].deviceInfo = devices[deviceName].deviceInfo || {}
      for (const data of additional.data) {
        const [name, value] = data.toString().split('=')
        
        devices[deviceName].deviceInfo[name] = value
      }
    } else {
      if (additional.type === 'A' || additional.type === 'AAAA') {

        devices[deviceName][additional.type] = { ip: additional.data, name: additional.name }
      } else {

        devices[deviceName][additional.type] = additional.data
      }
      console.log(additional.data);
      // data = a string so we handle it as a .local device
    }
  }
  console.log('got a response packet:', response.answers)

  console.log(devices);
  
})

mdns.on('query', function(query) {
  // Todo: edit /host to add support
  for (const question of query.questions) {
    console.log(`discovered ${question.name}`);
  }
  // console.log('got a query packet:', query)
})

// lets query for an A record for 'brunhilde.local'
mdns.query({
  questions:[{
    name: '_googlecast._tcp.local',
    type: 'PTR'
  }, {
    name: '_apple-mobdev._tcp.local',
    type: 'PTR'
  }, {
    name: '_services._dns-sd._udp',
    type: 'PTR'
  }, {
    name: '_adb._tcp.local',
    type: 'PTR'
  }, {
    name: '_printer._tcp.local',
    type: 'PTR'
  }, {
    name: '_scanner._tcp.local',
    type: 'PTR'
  }]
})