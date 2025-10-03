/* eslint-disable react/no-deprecated */
// specific Polyfill for react-draggable with React 19
// This file is executed on the client side to provide compatibility

if (typeof window !== 'undefined') {
  const originalRequire = require;
  
  const Module = require('module');
  const originalResolveFilename = Module._resolveFilename;
  
  Module._resolveFilename = function (request: string, parent: any, isMain: boolean) {
    if (request === 'react-dom') {
      const reactDom = originalRequire('react-dom');
      
      if (!reactDom.findDOMNode) {
        const React = originalRequire('react');
        
        reactDom.findDOMNode = (instance: any) => {
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
      
      return 'react-dom';
    }
    
    return originalResolveFilename.call(this, request, parent, isMain);
  };
}

export {};
