


const GetTokens = (TokenTag) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === TokenTag) {
        return JSON.parse(cookieValue);
      }
    }
    console.log("no tokens")
  }
export {GetTokens}

    const RefreshTokens = async(refreshToken) =>{
      if(refreshToken){
        const body = {
          "refreshToken":refreshToken
        }
        console.log("refresh token body:"+refreshToken)
        try{
          const response = await fetch("https://localhost:7011/refresh", {
             method: 'POST', 
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify(body)
             })
         const data = response.json()
         console.log("new tokens: "+ JSON.stringify(data))
         return data

        }
        catch(error){
          console.log("error: "+error)
          return null
        }
      }
    }

const VerifyToken = async(tokens,setCurrentUser) =>{
        if(tokens){
        try{
          const response = await fetch("https://localhost:7011/Authenticate", {
           method: 'GET', 
           headers: {
             'Authorization': `Bearer ${tokens.accessToken}`
           },
         })
         const username = await response.json()
           console.log("response: "+ username)
           setCurrentUser(username)
           return true
           console.log("it shouldnt get here----------------------")
        }
      catch(error){ //if it is unbale to authenticate it sends the refresh token and gets a new token.
        console.log("error: "+error)
        if(tokens.refreshToken){
          console.log("trying to refresh the token")
          
          /// need to fix this
          const newTokens = await RefreshTokens(tokens.refreshToken)////
          // if (newTokens === null) return false
          console.log("new tokens22222: "+ JSON.stringify(newTokens))////
          console.log("new tokens22222: "+ typeof(newTokens))////
          const newCookie = `jwt_token=${JSON.stringify(newTokens)}`
          console.log('new cookie:  '+ newCookie)
          document.cookie = newCookie////
          const verifyToken = await VerifyToken(newTokens,setCurrentUser)
          return verifyToken
        }
        else{
          return false
        }
      }
    }
    }

    export {VerifyToken}


    const Logout = async(setCurrentUser) =>{
        const tokens = GetTokens("jwt_token")

        if(tokens){
            try{
              const response = await fetch("https://localhost:7011/Authenticate", {
               method: 'DELETE', 
               headers: {
                 'Authorization': `Bearer ${tokens.accessToken}`
               },
             })
             setCurrentUser(null)
            }
          catch(error){ //if it is unbale to authenticate it sends the refresh token and gets a new token.
            console.log("error: "+error)

          }
        }
    }
    export {Logout}

    const DeleteCookie = (tokenTag) =>{
      document.cookie = tokenTag + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    export{DeleteCookie}