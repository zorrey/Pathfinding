//import './node.css'

export function dijkstra ( grid, startNode, finishNode ) { // props - grid, startNode, finishNode
 // console.log(isFinish, isStart)
 const visitedSorted = []
 startNode.distance = 0

 //console.log('startNode--dijk--', startNode, startNode.distance)
    const unvisited = getAllNodes(grid) 
    
    while( !!unvisited.length ){
        sortNodes(unvisited)
        const closest = unvisited.shift()
        if(closest.isWall) continue
        if(closest.distance === Infinity) { console.log('cannot find the path')   ; return [] }
        closest.isVisited = true
        visitedSorted.push(closest)
        if(closest === finishNode) {
            console.log('got finish node')
            return visitedSorted
        }
        updateNeighbours(closest, grid)
    }
}

function updateNeighbours (closest, grid){
    const unvisitedNeighbours = getNeighbours(closest, grid)
    for(const n of unvisitedNeighbours){
        n.distance = closest.distance + 1   
        n.previous = closest
    }
}

function getNeighbours (closestNode, grid){
    //console.log('closest', closestNode)
    const neighbours = []
    const {row, col} = closestNode
    if( row>0 ) neighbours.push(grid[row-1][col])
    if( row < grid.length-1 ) neighbours.push(grid[row+1][col])
    if( col > 0 ) neighbours.push(grid[row][col-1])
    if( col < grid[0].length-1 ) neighbours.push(grid[row][col+1])
    //console.log('neighbours', neighbours)
    let unvisitedNeighbours  = neighbours.filter( n => {return n.isVisited === false})
    //console.log("unvisited neighbours", unvisitedNeighbours)
    return unvisitedNeighbours
}

function getAllNodes(grid){
    const nodes=[]   
    for(let i=0; i<grid.length;i++){
        for(let j=0; j<grid[i].length; j++){
          nodes.push(grid[i][j])
        }
      }
    //  console.log('nodes---', nodes)
      return nodes
}
function sortNodes(unvisited){
    unvisited.sort((a,b)=>
        a.distance-b.distance
    )
}
export function getShortPath(finishNode){
    //console.log('shortPath - FN', finishNode)
    const shortPath = []
      let current = finishNode
      
      while(current !== null ){
        shortPath.unshift(current)
        current = current.previous
    
      }
      return shortPath
  }
export function getMessage()  {
    
}