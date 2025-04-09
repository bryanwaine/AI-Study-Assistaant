const Login = () => {
    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form">
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};    

export default Login