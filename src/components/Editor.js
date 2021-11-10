import React from 'react'



const Editor = () => {
    const counterRef = React.useRef();
    const { quill, quillRef, Quill } = useQuill({ modules: { counter: true } });
  
    if (Quill && !quill) {
      // For execute this line only once.
      Quill.register('modules/counter', function(quill, options) {
        quill.on('text-change', function() {
          const text = quill.getText();
          // There are a couple issues with counting words
          // this way but we'll fix these later
          counterRef.current.innerText = text.split(/\s+/).length;
        });
      });
    }
  
    return (
      <div style={{ width: 500, height: 300 }}>
        <div ref={quillRef} />
        <div ref={counterRef} />
      </div>
    );
  };

  export default Editor