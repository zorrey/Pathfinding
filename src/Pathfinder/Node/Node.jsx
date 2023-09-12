import './node.css'

export default function Node ( props ) {
 // console.log(isFinish, isStart)
 // console.log('props----',props)
  const extra = props.isFinish ? 
                    'node-finish': 
                    props.isStart ? 'node-start' :
                    props.isWall ? 'node-wall':
                    "" ;
    return (
        <div 
            id={    `node-${props.row}-${props.col}`}
            className={ `node ${extra}` }
            onMouseDown={()=> props.onMouseDown(props.row, props.col)}  
            onMouseUp={()=> props.onMouseUp()}  
            onMouseEnter={()=> props.onMouseEnter(props.row, props.col)}                    
        > <span className='text'>{props.distance===Infinity? "": props.distance}  </span >            
        <span style={{color: "blue", fontSize:"0.5em"}} > {props.total===Infinity? "": props.total}    </span>           
        </div>
      );
}
//export default Node;