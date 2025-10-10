/* eslint-disable react/no-deprecated */
// Temporary findDOMNode in React 19
// This allows react-draggable to work until it is updated

declare module 'react' {
  function findDOMNode(instance: any): Element | null;
}

if (typeof window !== 'undefined') {
  const React = require('react');
  if (!React.findDOMNode) {
    React.findDOMNode = (instance: any) => {
      if (instance == null) {
        return null;
      }
      
      if (instance.nodeType === 1) {
        return instance;
      }
      
      if (instance._reactInternalFiber || instance._reactInternalInstance) {
        const fiber = instance._reactInternalFiber || instance._reactInternalInstance;
        if (fiber && fiber.stateNode) {
          return fiber.stateNode;
        }
      }
      
      if (instance.refs && instance.refs.current) {
        return instance.refs.current;
      }
      
      if (typeof instance.getDOMNode === 'function') {
        return instance.getDOMNode();
      }
      
      return null;
    };
  }
}
