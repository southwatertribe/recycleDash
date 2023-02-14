import React from 'react'

function Login() {
  return (
    <div>
        <h1>Sign In</h1>
        <form className="form" onSubmit={()=>{console.log("Yo")}}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="nome@email.com.br" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input type="password" name="password" />
          </div>
          <button className="primary">ENTRAR</button>
        </form>
        <a href='https://www.youtube.com/watch?v=r0lXp28xTbU'>register</a>
    </div>
  )
}

export default Login