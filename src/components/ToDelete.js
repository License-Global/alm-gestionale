import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ToDelete = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      {/* <button onClick={reactToPrintFn}>Print</button>
      <div ref={contentRef}>Content to print</div> */}
    </div>
  );
};

export default ToDelete;
