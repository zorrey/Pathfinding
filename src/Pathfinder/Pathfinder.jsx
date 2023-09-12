import './pathfinder.css'
import React, { useState } from 'react';
import Node from './Node/Node.jsx'
import {dijkstra , getShortPath} from './dijkstra'
import {aStar, getShortPathA } from './aStar'

let rowNum = 12;
let colNum = 20;
const startRow = 1;
const startCol = 0;
const finishRow = Math.floor(rowNum/2);
const finishCol = colNum-1;

let matrix = new Array(rowNum)

function Pathfinder () {
/*   const color={
    start: false,
    target: false,
    wall: true
  } */
  const [matrixState, setMatrixState] = useState(matrix)
  //console.log("matrixState----", matrixState)
  const [mouseState, setMouseState] = useState(false)
  const[inputState, setInputState] = useState({
                                                startNode: false,
                                                finishNode: false,
                                                wallNode: true
                                                })
  const[startState, setStartState] = useState({row: startRow,
                                              col: startCol})                                             
  const[targetState, setTargetState] = useState({row: finishRow,
                                              col: finishCol})                                             
  const[message, setMessage] = useState({message: "Let's play!",
                                              error: ""})   
 const [color, setColor] = useState({ start: false,
                                      target: false,
                                      wall: true
                                    });  
//const [distance, setDistance] = useState({distanceMatrix})
                                    /*   const isActive = { start: false,
                     target: false,
                     wall: true 
                  }                                                                                    
 */
  const createNode= (row , col)=>{
    return {    
      row,
      col,
      isStart: row===startState.row && col===startState.col,
      isFinish: row===targetState.row && col===targetState.col,
      isWall: false,
      isVisited: false,
      distance: Infinity,
      finishDistance: Infinity,
      previous: null,
      total: Infinity
    }
  }  

  const getMatrix= () => {
    for(let i=0; i<matrix.length; i++){
      matrix[i] = new Array(colNum)
                  .fill()
                  .map((u,j) => {
                    u = createNode(i,j)
                    return u;
                  })
    }
    return matrix;
  }

  getMatrix()

  const getWalls=(grid, row, col)=>{
    const newgrid = grid.slice();
    const node = newgrid[row][col];
    const newnode = { ...node, isWall: !node.isWall}
    newgrid[row][col] = newnode;
    return newgrid;
}
 
  const handleMouseDown = (row, col)=>{
    //console.log('handleMouseDown-row+col----', row,col)
    if(inputState.wallNode) {
      const newMatrix = getWalls(matrixState, row, col)
      setMatrixState(newMatrix)
    }
    if(inputState.startNode) {
      const newMatrix = getStart(matrixState, row, col)
      setMatrixState(newMatrix)
    }
    if(inputState.finishNode) {
      const newMatrix = getTarget(matrixState, row, col)
      setMatrixState(newMatrix)
    }
   
  }

  const handleMouseUp = ()=>{
    setMouseState(false)
  /*   setInputState({
                            startNode: false,
                            finishNode: false,
                            wallNode:false
                            }) */
  }
  const handleMouseEnter = (row, col)=>{
    if(!mouseState) return
    if(inputState.wallNode)    {
      const newMatrix = getWalls(matrixState, row, col)
      setMatrixState(newMatrix)
    }
    if(inputState.startNode)    {
      const newMatrix = getStart(matrixState, row, col)
      setMatrixState(newMatrix)
    }
    if(inputState.finishNode)    {
      const newMatrix = getTarget(matrixState, row, col)
      setMatrixState(newMatrix)
    }

  }

 const animateDijkstra = (visitedSorted, shortPath)=>{
  console.log('animateDijkstra','visitedSorted----', visitedSorted, 'shortPath', shortPath )
  for(let i =0; i<= visitedSorted.length; i++){
    if(i===visitedSorted.length){
      setTimeout(()=>{
        animatePath(shortPath)
      }, 5*i);
      return;
    }
    setTimeout(()=>{
      const node = visitedSorted[i];
      if(node.row === startState.row && node.col===startState.col) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
      else if(node.row === targetState.row && node.col===targetState.col) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
      else if(node.isWall) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
      else document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited'
    }, 5*i)
  }
  }
 const cleanGrid = ()=>{
  console.log('clean----' )
  let newgrid = matrixState.slice()
  for(let i =0; i< newgrid.length; i++){
   for(let j=0; j< newgrid[0].length; j++){    
      const node = newgrid[i][j];
      const newnode = createNode( i,j )
      if( node.row === startState.row && node.col === startState.col ) {
        newnode.isStart = true
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
       
      }
     else if(node.row === targetState.row && node.col===targetState.col) {
      newnode.isFinish = true
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
    }
     else if(node.isWall) {
      newnode.isWall = true
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
    }
     else document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
     newgrid[i][j] = newnode
    
  }
  }
  setMatrixState(newgrid)
  }
 const cleanWalls = ()=>{
  console.log('cleanWalls' )
  let newgrid = matrixState.slice()
  for(let i =0; i< newgrid.length; i++){
   for(let j=0; j< newgrid[0].length; j++){    
      const node = newgrid[i][j];
      const newnode = createNode( i,j )
      if( node.row === startState.row && node.col === startState.col ) {
        newnode.isStart = true
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
       
      }
     else if(node.row === targetState.row && node.col===targetState.col) {
      newnode.isFinish = true
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish'
    }
     /* else if(node.isWall) {
      newnode.isWall = true
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall'
    } */
     else document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
     newgrid[i][j] = newnode
    
  }
  }
  setMatrixState(newgrid)
  }

  const animatePath = (shortPath)=>{
    for(let i =0; i< shortPath.length; i++){ 
   
      setTimeout(()=>{
        const node = shortPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortpath'
      }, 30*i)
    }
  }

  const visualizeDijkstra=  () => {  
    cleanGrid()
    setMessage({message: "Let's play!", error: ""})
    let visitedSorted =[]
    console.log('visualizeDijkstra')
   // const {grid} = matrixState
    const startNode = matrixState[startState.row][startState.col];    
    console.log('startNode-Dijkstra---', startNode)
    const finishNode = matrixState[targetState.row][targetState.col]
    console.log('finishNode-Dijkstra---', finishNode)
    visitedSorted = dijkstra(matrixState, startNode, finishNode)    
    console.log('visitedSorted-Dijkstra---', visitedSorted)
    const shortPath = getShortPath(finishNode)
    console.log('shortPath-Dijkstra---', shortPath)
    if(visitedSorted.length === 0) setMessage(prev =>  ({ ...prev, error: "There is no path! Change the walls location"}))
    else animateDijkstra(visitedSorted, shortPath )
  }
  const visualizeAStar=  () => {  
    cleanGrid()
    setMessage({message: "Let's play!",
                                              error: ""})
    let visitedSorted =[]
    console.log('visualizeAStar')
   // const {grid} = matrixState
    const startNode = matrixState[startState.row][startState.col];    
    
    const finishNode = matrixState[targetState.row][targetState.col]
   
    visitedSorted = aStar(matrixState, startNode, finishNode)    
    console.log('visitedSorted-A*---', visitedSorted)
    const shortPath = getShortPathA(finishNode)
    console.log('shortPath-Dijkstra---', shortPath)
    if(visitedSorted.length === 0) setMessage(prev =>  ({ ...prev, error: "There is no path! Change the walls location"}))
    else animateDijkstra(visitedSorted, shortPath )
  }
  const handleStartNode= () => {
    console.log('handleStartNode')
    setInputState({wallNode:false, finishNode:false, startNode:true})
    setColor(prev=>({...prev, start:true, target:false, wall:false}))
    setMessage(prev=>({...prev, message:"Click the grid tile where the start node is.", error:""}))
    console.log(color)
  }
  const handleTargetNode= () => {
    console.log('handleTargetNode')
    setInputState({wallNode:false, finishNode:true, startNode:false})
    setColor(prev=>({...prev, start:false, target:true, wall:false}))
    setMessage(prev=>({...prev, message:"Click the grid tile where the target node is.", error:""}))
  }
  const handleWallNode= () => {
    console.log('handleWallNode')
    setInputState({wallNode:true, finishNode:false, startNode:false})
    setColor(prev=>({...prev, start:false, target:false, wall:true}))
    setMessage(prev=>({...prev, message:"Click the grid tile where the wall node is.", error:""}))
  }

  const getStart=(grid, row, col)=>{
    //console.log('grid---',grid, row,col)
        const newgrid = grid.slice();
        const node = newgrid[row][col];
        
        const oldStartNode = newgrid[startState.row][startState.col];
        const justNode = { ...oldStartNode, isStart: false}
        newgrid[startState.row][startState.col] = justNode;
        const newnode = { ...node, isStart: true}
        newgrid[row][col] = newnode;
        setStartState ({row: newnode.row, col: newnode.col}) 
        //console.log( 'newgrid----', newgrid )
        return newgrid;
    
    }
  const getTarget=(grid, row, col)=>{
    //console.log('grid---',grid, row,col)
        const newgrid = grid.slice();
        const node = newgrid[row][col];
        
        const oldFinishNode = newgrid[targetState.row][targetState.col];
        const justNode = { ...oldFinishNode, isFinish: false}
        newgrid[targetState.row][targetState.col] = justNode;
        const newnode = { ...node, isFinish: true}
        newgrid[row][col] = newnode;
        setTargetState ({row: newnode.row, col: newnode.col}) 
        //console.log( 'newgrid----', newgrid )
       
        return newgrid;
    
    }

        
   
 

    return (
        <div className="container">
          <h1>Pathfinder</h1>
                   
            <nav className='nav-bar'>
                <ul className='row'>
                    <li> <button onClick={ ()=>handleStartNode() } style={{color: color.start? "red": ""}}>Start Node</button> </li>
                    <li> <button onClick={ ()=>handleTargetNode() }  style={{color: color.target? "red": ""}}>Targer Node</button> </li>
                    <li> <button onClick={ ()=>handleWallNode() }c style={{color: color.wall? "red": ""}} >Wall Nodes</button> </li>
                    <li>  <div className='dropdown'>                        
                          <button className='dropbtn'>Algorithms</button>
                          <div className='drop-content'>
                            <button  onClick={ ()=>visualizeDijkstra() }>Dijkstra</button>
                            <button onClick={ ()=>visualizeAStar() }>A* Search</button>
                          </div>
                       
                      </div>  </li>
                    <li><div className='dropdown'>   
                      <button  className='dropbtn' >Clean</button>
                      <div className='drop-content'>
                            <button   onClick={ ()=>cleanGrid() } >Clean visited</button>
                            <button  onClick={ ()=>cleanWalls() } >Clean walls</button>
                          </div>
                    </div></li>
                </ul>
            </nav>
            <div className='main'>
              <div className='grid'>
                {
                 <table className='tablelayout'>
                <tbody>
                  {
                    matrixState.map((rowNode, idx) => {
                     
                     // console.log('row-' , `${idx}--`, rowNode)
                        return(
                          <tr key={idx} className='gridrow'>
                    
                        {      
                              rowNode.map((colNode, ind)=>{
                                const {row, col, isFinish, isStart, isWall, distance, total} = colNode
                                
                                return(
                                  <td key={idx +',' + ind} id={idx +',' + ind} className='tbcell'>
                                      <Node 
                                        col = {col}
                                        row = {row}
                                        key={ind}
                                        distance = {distance}
                                        total = {total}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                        onMouseEnter={handleMouseEnter}   
                                                                     
                                      />
                                 
                                  </td>
                                )
                              })
                              
                              }
                          </tr>
                        )
                    })
                  }
                </tbody>
                </table>

               }
               
              </div> {/* grid */}
          
            </div> {/* main */}
            <div className="message">
              { message.message } <br />
            <span style={{color: message.error? "red": ""}}>{ message.error? "error: "+message.error: "" }</span>  
            </div>
          </div> //container
        
      );
}

export default Pathfinder;