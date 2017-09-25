/*!
 * rewrite parse5 serializer
 */

import parse5 from 'parse5'
import * as HTML from './commonElement.js'

const htmlparser2Adapter = parse5.treeAdapters.htmlparser2

//Escaping regexes
const AMP_REGEX = /&/g
const NBSP_REGEX = /\u00a0/g
const DOUBLE_QUOTE_REGEX = /"/g
const LT_REGEX = /</g
const GT_REGEX = />/g;

//Aliases
const $ = HTML.TAG_NAMES

class Serializer {
  constructor(node, options = {}) {
    this.options = options;
    this.treeAdapter = this.options.treeAdapter || htmlparser2Adapter;
    this.html = '';
    this.startNode = node;
  }

  escapeString(str, attrMode) {
    str = str
      .replace(AMP_REGEX, '&amp;')
      .replace(NBSP_REGEX, '&nbsp;');

    if (attrMode)
      str = str.replace(DOUBLE_QUOTE_REGEX, '&quot;');

    else {
      str = str
        .replace(LT_REGEX, '&lt;')
        .replace(GT_REGEX, '&gt;');
    }

    return str;
  }

  serialize() {
    this._serializeChildNodes(this.startNode);

    return this.html;
  }

  _serializeChildNodes(parentNode) {
    var childNodes = this.treeAdapter.getChildNodes(parentNode);

    if (childNodes) {
      for (var i = 0, cnLength = childNodes.length; i < cnLength; i++) {
        var currentNode = childNodes[i];

        if (this.treeAdapter.isElementNode(currentNode))
          this._serializeElement(currentNode);

        else if (this.treeAdapter.isTextNode(currentNode))
          this._serializeTextNode(currentNode);

        else if (this.treeAdapter.isCommentNode(currentNode))
          this._serializeCommentNode(currentNode);

      }
    }
  }

  _serializeElement(node) {
    var tn = this.treeAdapter.getTagName(node);
    var ns = this.treeAdapter.getNamespaceURI(node);

    this.html += '<' + tn;
    this._serializeAttributes(node);

    //import input slider cover-image icon template[is]
    //progress checkbox radio switch textarea include
    const isSingleCloseTN = tn === $.IMPORT || tn === $.INPUT ||
      tn === $.SLIDER || tn === $.COVERIMAGE || tn === $.ICON ||
      tn === $.PROGRESS || tn === $.CHECKBOX || tn === $.RADIO ||
      tn === $.SWITCH || tn === $.TEXTAREA || tn === $.INCLUDE ||
      (tn === $.TEMPLATE && (node.attribs && node.attribs.is))

    // 单闭合标签
    if (isSingleCloseTN) {
      this.html += '/>';
    } else {
      this.html += '>'
    }

    if (!isSingleCloseTN) {
      //template[name] 模板声明
      // var childNodesHolder = tn === $.TEMPLATE ?
      //   this.treeAdapter.getTemplateContent(node) :
      //   node;

      var childNodesHolder = node

      this._serializeChildNodes(childNodesHolder);
      this.html += '</' + tn + '>';
    }
  }

  _serializeAttributes(node) {
    var attrs = this.treeAdapter.getAttrList(node);

    for (var i = 0, attrsLength = attrs.length; i < attrsLength; i++) {
      var attr = attrs[i];
      var value = this.escapeString(attr.value, true);

      this.html += ' ';

      if (!attr.namespace)
        this.html += attr.name;
      else
        this.html += attr.namespace + ':' + attr.name;

      this.html += '="' + value + '"';
    }
  }

  _serializeTextNode(node) {
    var content = this.treeAdapter.getTextNodeContent(node);
    var parent = this.treeAdapter.getParentNode(node);
    var parentTn = null;

    if (parent && this.treeAdapter.isElementNode(parent))
      parentTn = this.treeAdapter.getTagName(parent);

    if (parentTn === $.IMPORT)
      this.html += content;
    else
      this.html += this.escapeString(content, false);
  }


  _serializeCommentNode(node) {
    this.html += '<!--' + this.treeAdapter.getCommentNodeContent(node) + '-->';
  }
}

export default Serializer
