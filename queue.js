const ERR = {
  add: '添加的索引不正常',
  delete: '删除的索引不正常',
  get: '获取的索引不正常'
}

class Node {
  constructor(element, pre, next) {
    this.element = element
    this.next = next
    this.pre = pre
  }
}

class LinkList {
  constructor() {
    this.head = null
    this.tail = null
    this.size = 0
  }

  add(element, index) {
    if (typeof index !== 'undefined' && typeof index !== "number") throw new Error(ERR.add)
    if (this.size === 0) {
      if (typeof index === 'number' && index !== 0) throw new Error(ERR.add)
      return this.addFirst(element)
    }
    if (index < 0 || index > this.size) throw new Error(ERR.add)
    if (typeof index === "undefined" || index === this.size) return this.addTail(element)
    else if (index === 0) return this.addHead()
    else {
      let preElement, nextElement
      if (index < this.size / 2) {
        preElement = this.head
        for (let i = 0; i < index - 1; i++) {
          preElement = preElement.next
        }
        nextElement = preElement.next
      } else {
        nextElement = this.tail
        for (let i = this.size; i > index + 1; i--) {
          nextElement = nextElement.pre
        }
        preElement = nextElement.pre
      }
      let node = new Node(element, preElement, nextElement)
      preElement.next = node
      nextElement.pre = node
      this.size++
    }
  }

  addHead(element) {
    if (this.size === 0) return this.addFirst(element)
    let newHead = new Node(element, null, this.head)
    this.head.pre = newHead
    this.head = newHead
    this.size++
  }

  addTail(element) {
    if (this.size === 0) return this.addFirst(element)
    let tail = new Node(element, this.tail, null)
    this.tail.next = tail
    this.tail = tail
    this.size++
  }

  addFirst(element) {
    this.head = this.tail = new Node(element, null, null)
    this.size++
  }

  peek() {
    if (this.size === 0) return
    if (this.size === 1) {
      let head = this.head
      this.head = this.tail = null
      this.size--
      return head
    }
    let head = this.head
    this.head = this.head.next
    this.head.pre = null
    this.size--
    return head
  }

  remove(index) {
    if (index < 0 || index >= this.size) throw new Error(ERR.delete)
    let removeItem
    this.size--
    if (index === 0) {
      removeItem = this.head
      this.head = this.head.next
    } else {
      let current = this.head
      for (let i = 0; i < index - 1; i++) {
        current = current.next
      }
      removeItem = current.next
      current.next = current.next.next
    }
    return removeItem
  }

  get(index) {
    if (index < 0 || index >= this.size) throw new Error(ERR.get)
    if (index === 0) return this.head
    if (index === this.size) return this.tail
    let current
    if (index < this.size / 2) {
      current = this.head
      for (let i = 0; i < index; i++) {
        current = current.next
      }
    } else {
      current = this.tail
      for (let i = this.size; i > index; i--) {
        current = current.pre
      }
    }
    return current
  }
}

class Queue {
  constructor() {
    this.queue = new LinkList()
    this.runState = false
  }

  async run() {
    this.runState = true
    let { element } = await this.queue.peek() || {}
    if (!element) return this.runState = false
    await element()
    this.run()
  }

  push(callback) {
    this.queue.addTail(callback)
    if (!this.runState) this.run()
  }

  unshift(callback) {
    this.queue.addHead(callback)
    if (!this.runState) this.run()
  }
}


module.exports = Queue