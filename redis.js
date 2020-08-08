const redis = require('redis')

class Redis {
  constructor({ port, host } = {}) {
    this.client = redis.createClient(port, host)
  }
  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) return reject(err)
        try {
          result = JSON.parse(result)
        } catch (e) { }
        resolve(result)
      })
    })
  }
  set(key, value, { expire } = {}) {
    return new Promise((resolve, reject) => {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      this.client.set(key, value, err => {
        if (err) return reject(err)
        if (expire) {
          this.client.EXPIRE(key, expire, (err, number) => {
            if (err) return reject(err)
            resolve(number)
          })
        } else {
          resolve()
        }
      })
    })
  }
  del(key) {
    this.client.del(key)
  }
  keys(pattern) {
    return new Promise((resolve, reject) => {
      this.client.keys(pattern, (err, keys) => {
        if (err) reject(err)
        resolve(keys)
      })
    })
  }
  delPattern(pattern) {
    return new Promise(async (resolve, reject) => {
      try {
        this.del(await this.keys(pattern))
        resolve()
      } catch (e) { reject(e) }
    })
  }
}

['incr', 'decr'].forEach(funcName => {
  Redis.prototype[funcName] = function (key) {
    return new Promise((resolve, reject) => {
      const multi = this.client.multi()
      multi[funcName](key)
      multi.exec((err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
})

module.exports = Redis

