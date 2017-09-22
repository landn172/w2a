import htmlparser2 from 'htmlparser2'
import Serializer from './serializer/index.js'

export function parseXML2Node(xml) {
  const domNode = htmlparser2.parseDOM(xml, {
    xmlMode: true
  })
  const rootNode = {
    type: 'root',
    name: 'root',
    parent: null,
    children: domNode
  }
  return rootNode
}

export function Node2XML(node) {
  const serializer = new Serializer(node)

  return serializer.serialize()
}
