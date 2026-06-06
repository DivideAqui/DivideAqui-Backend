let usuariosenviados = [];//Usar isso enquanto nois n tiver um banco de dados

class UsuarioControllers {
     
    //pull
    async criar(req, res){
        const{nome, email, senha}= req.body;

        if (!nome || !email || !senha ){
            return res.status(400).json({erro: 'Campos não informados!'});
        };
        const novoUsuario ={
            id: Math.random().toString(36).substr(2,9),
            nome,
            email,
            senha,
    };
    
    usuariosenviados.push(novoUsuario)
    return res.status(201).json({ mensagem: "Usuário cadastrado!", usuario: novoUsuario });
    }

    listar(){
        return usuariosenviados;
    }
    
}
export default new UsuarioControllers();
