/* eslint-disable react/no-deprecated */
// Polyfills for React 19 compatibility
// This file is executed on the client side to provide compatibility

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

  try {
    const ReactDOM = require('react-dom');
    if (ReactDOM && !ReactDOM.findDOMNode) {
      ReactDOM.findDOMNode = React.findDOMNode;
    }
  } catch (e) {
  }

  (window as any).React = React;
  (window as any).ReactDOM = require('react-dom');
  
  if (!(window as any).React.findDOMNode) {
    (window as any).React.findDOMNode = React.findDOMNode;
  }
  
  if (!(window as any).ReactDOM.findDOMNode) {
    (window as any).ReactDOM.findDOMNode = React.findDOMNode;
  }
}

export {};
