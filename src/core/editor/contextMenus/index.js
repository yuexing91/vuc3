//获取node包含的slot列表
function getNodeInsertSlotHandler(node) {
  let config = node.getConfig();
  if (config && config.slots) {
    let children = config.slots.map((slot) => {
      return {
        text: slot.name,
        slot,
        handler(node, editor) {
          editor.insertToSlot(node, slot.slot);
        },
      };
    });
    return children;
  }
}

//node 可以移动到同级的slot列表
function getNodeMoveSlotHandler(node) {
  let parent = node.getParentNode();
  if (parent) {
    let config = parent.getConfig();
    if (config && config.slots) {
      let slotName = node.getBelongSlotName();
      let children = config.slots
        .map((slot) => {
          if (slot.slot === slotName) return;
          return {
            text: slot.name,
            slot,
            handler(node, editor) {
              editor.moveToSlot(node, slot.slot);
            },
          };
        })
        .filter((v) => v);
      return children;
    }
  }
}

function createBaseMenus() {
  return [
    {
      text: '移动',
      handler(node, editor) {
        editor.dropStart(this.event, node, {
          x: 0,
          y: 0,
          width: '100px',
          height: '30px',
        });
      },
    },
    {
      text: '前移',
      handler(node, editor) {
        editor.moveToBefore(node);
      },
    },
    {
      text: '后移',
      handler(node, editor) {
        editor.moveToAfter(node);
      },
    },
    {
      text: '删除',
      handler(node, editor) {
        editor.removeNode(node);
      },
    },
  ];
}

function createParseMenus(curNode, copyNode) {
  let menus = [
    {
      text: '复制',
      handler(node, editor) {
        editor.copyNode(node);
      },
    },
    {
      text: '剪切',
      handler(node, editor) {
        editor.cutNode(node);
      },
    },
    {
      text: '重复',
      handler(node, editor) {
        editor.repeatNode(node);
      },
    },
  ];

  if (copyNode && copyNode !== curNode) {
    menus.push({
      text: '粘贴',
      children: [
        {
          text: '前面',
          handler(node, editor) {
            editor.parseNode(node, 'before');
          },
        },
        {
          text: '后面',
          handler(node, editor) {
            editor.parseNode(node, 'after');
          },
        },
      ],
    });

    let slotMenus = getNodeInsertSlotHandler(curNode);
    if (slotMenus) {
      menus.push({
        text: '粘贴到插槽',
        children: slotMenus,
      });
    }
  }

  return menus;
}

function createMoveMenus(curNode) {
  if (curNode) {
    let moveMenus = getNodeMoveSlotHandler(curNode);
    if (moveMenus && moveMenus.length) {
      return [
        {
          text: '移动到',
          children: moveMenus,
        },
      ];
    }
  }
}

export function createMenus(editor) {
  let curNode = editor.currentNode;
  let menus = createBaseMenus();

  let parseMenus = createParseMenus(curNode, editor.curCopyNode);

  let moveMenus = createMoveMenus(curNode);

  if (parseMenus && parseMenus.length) {
    menus.push({
      divided: true,
    });
    menus = menus.concat(parseMenus);
  }

  if (moveMenus && moveMenus.length) {
    menus.push({
      divided: true,
    });
    menus = menus.concat(moveMenus);
  }

  return menus;
}
