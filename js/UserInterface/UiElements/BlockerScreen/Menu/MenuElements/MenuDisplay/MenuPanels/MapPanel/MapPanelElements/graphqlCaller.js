const DEFAULT_SRC = 'https://raw.githubusercontent.com/Spacetime-Meta/spacetime-metadata/main/defaultChunk.json'

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://balanced-bulldog-49.hasura.app/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

// The following query is for search bar with locations
 const searchByLocation = (x,y,z) => { return `
 query MyQuery {
   spaceState_v3(where: {x: {_eq: ${x}}, y: {_eq: ${y}}, z: {_eq: ${z}}}) {
     loc
     logo
     name
     x
     y
     z
   }
 }
`};

// the following query search by name
const searchByName = (input) => { return `
  query MyQuery {
    search_chunks_aggregate(args: {search: "${input}"}) {
      nodes {
        name
        logo
        loc
        x
        y
        z
      }
    }
  }
`};


function fetchMyQuery(query) {
    return fetchGraphQL(
        query,
        "MyQuery",
        {}
    );
}

async function getSearchBarQuery(input) {

    let query;
    if(typeof input === "string") {
        if(input.length < 3) { return undefined; }
        query = searchByName(input);
    } else {
        query = searchByLocation(input.x, input.y, input.z);
    }

    const { errors, data } = await fetchMyQuery(query);
  
    if (errors) { 
        console.error(errors);
        return undefined; 
    }
  
    // do something great with this precious data
    return data;
  }









/**
 * the following logic is specific to the space sectors
 */

const spaceSectorQuery = (minX, maxX, minY, maxY, minZ, maxZ) => { return `
query MyQuery {
  spaceState_v3 (where: {x: {_gte: ${minX}, _lte: ${maxX}}, y: {_gte: ${minY}, _lte: ${maxY}}, z: {_gte: ${minZ}, _lte: ${maxZ}}}){
    planet
    image
    loc
    logo
    name
    portal
  }
}
`};

function fetchMySector(minX, maxX, minY, maxY, minZ, maxZ) {
  return fetchGraphQL(
    spaceSectorQuery(minX, maxX, minY, maxY, minZ, maxZ),
    "MyQuery",
    {}
  );
}

async function getSpaceSector(minX, maxX, minY, maxY, minZ, maxZ) {
    const spaceState = {}
    var defaultdata;
    fetch(DEFAULT_SRC)
        .then(response => { return response.json() })
        .then(jsondata => { defaultdata = jsondata })

    const { errors, data } = await fetchMySector(minX, maxX, minY, maxY, minZ, maxZ);

    if(errors) { console.error(errors) }

    for(var i=0 ; i<data.spaceState_v3.length; i++){
        const entry = data.spaceState_v3[i]
        spaceState[entry.loc] = Object.assign({}, defaultdata)
        
        spaceState[entry.loc]["location"] =  {
            "x": parseInt(entry.loc.split(',')[0]),
            "y": parseInt(entry.loc.split(',')[1]),
            "z": parseInt(entry.loc.split(',')[2])
        }

        if(entry.name !== "") {
          spaceState[entry.loc]['name'] = entry.name
        }

        if(entry.portal !== "") {
          spaceState[entry.loc]['portal'] = entry.portal
        } else {
            spaceState[entry.loc]['portal'] = "https://stdkit-dev.netlify.app/examples/terrain-generation/index.html?x="+entry.loc.split(',')[0]+"&y="+entry.loc.split(',')[1]+"&z="+entry.loc.split(',')[2]
        }

        if(entry.image !== "") {
          spaceState[entry.loc]['image'] = entry.image
        }        

        if(entry.planet !== "") {
          spaceState[entry.loc]['planet'] = entry.planet
        }
    }
    return spaceState;
}

export {getSpaceSector, getSearchBarQuery}
