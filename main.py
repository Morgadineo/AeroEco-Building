import logging
import os
import re
import secrets
from datetime import datetime

from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)

app = Flask(__name__)

# Em produção, defina FLASK_SECRET_KEY no ambiente.
# O fallback é aleatório e serve apenas para desenvolvimento local.
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or secrets.token_hex(32)

app.config.update(
    MAX_CONTENT_LENGTH=16 * 1024,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("FLASK_HTTPS_ONLY") == "1",
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJETOS = [
    {
        "titulo": "DevJournal",
        "descricao": (
            "Uma aplicação para organizar anotações de programação, "
            "registrar aprendizados e acompanhar a evolução dos estudos."
        ),
        "tecnologias": ["Python", "Flask", "SQLite", "HTML", "CSS"],
        "link": "https://github.com/",
        "categoria": "Aplicação web",
        "icone": "01",
    },
    {
        "titulo": "TaskFlow",
        "descricao": (
            "Um gerenciador de tarefas com prioridades, categorias "
            "e uma interface simples para manter a rotina organizada."
        ),
        "tecnologias": ["Python", "Flask", "Jinja2", "CSS"],
        "link": "https://github.com/",
        "categoria": "Produtividade",
        "icone": "02",
    },
    {
        "titulo": "PixelPortfolio",
        "descricao": (
            "Um portfólio responsivo que combina identidade visual, "
            "componentes reutilizáveis e boas práticas de acessibilidade."
        ),
        "tecnologias": ["HTML5", "CSS3", "JavaScript", "Flask"],
        "link": "https://github.com/",
        "categoria": "Frontend",
        "icone": "03",
    },
]

HABILIDADES = [
    {
        "categoria": "Frontend",
        "descricao": "Interfaces acessíveis e responsivas.",
        "itens": ["HTML5", "CSS3", "JavaScript", "Jinja2"],
    },
    {
        "categoria": "Backend",
        "descricao": "Lógica, rotas e aplicações web.",
        "itens": ["Python", "Flask", "SQL", "SQLite"],
    },
    {
        "categoria": "Ferramentas",
        "descricao": "Organização e desenvolvimento.",
        "itens": ["Git", "GitHub", "VS Code", "Terminal"],
    },
]

TRAJETORIA = [
    {
        "periodo": "2025 — Atual",
        "titulo": "Formação em desenvolvimento web",
        "descricao": (
            "Estudo de HTML, CSS, JavaScript e fundamentos de "
            "interfaces acessíveis e responsivas."
        ),
        "tipo": "Curso",
    },
    {
        "periodo": "2025 — Atual",
        "titulo": "Fundamentos de tecnologia",
        "descricao": (
            "Aprofundamento em lógica de programação, algoritmos, "
            "bancos de dados e desenvolvimento de software."
        ),
        "tipo": "Formação acadêmica",
    },
    {
        "periodo": "2026",
        "titulo": "Criação do DevJournal",
        "descricao": (
            "Desenvolvimento de uma aplicação pessoal para praticar "
            "Python, Flask, templates e persistência de dados."
        ),
        "tipo": "Projeto pessoal",
    },
    {
        "periodo": "2026",
        "titulo": "Primeiras experiências práticas",
        "descricao": (
            "Construção de páginas, organização de código e "
            "desenvolvimento de pequenos projetos para portfólio."
        ),
        "tipo": "Experiência inicial",
    },
]

EMAIL_RE = re.compile(
    r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+"
    r"@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
    r"(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$"
)


@app.get("/")
def index():
    return render_template(
        "index.html",
        projetos=PROJETOS,
        habilidades=HABILIDADES,
        trajetoria=TRAJETORIA,
        ano=datetime.now().year,
    )


@app.post("/contato")
def contato():
    nome = request.form.get("nome", "").strip()
    email = request.form.get("email", "").strip()
    mensagem = request.form.get("mensagem", "").strip()

    erros = []

    if not nome:
        erros.append("Informe seu nome.")
    elif len(nome) > 100:
        erros.append("O nome deve ter no máximo 100 caracteres.")

    if not email:
        erros.append("Informe seu e-mail.")
    elif len(email) > 254 or not EMAIL_RE.fullmatch(email):
        erros.append("Informe um endereço de e-mail válido.")

    if not mensagem:
        erros.append("Escreva uma mensagem.")
    elif len(mensagem) < 10:
        erros.append("A mensagem deve ter pelo menos 10 caracteres.")
    elif len(mensagem) > 3000:
        erros.append("A mensagem deve ter no máximo 3000 caracteres.")

    if erros:
        for erro in erros:
            flash(erro, "error")
        return redirect(url_for("index", _anchor="contato"))

    # O MVP não envia e-mails nem salva mensagens.
    # Não registramos o conteúdo pessoal no log.
    logger.info(
        "Formulário de contato validado. "
        "Nome informado: %s caracteres. "
        "Envio real ainda não configurado.",
        len(nome),
    )

    flash(
        "Os campos foram validados, mas o envio real ainda não está "
        "configurado. Nenhuma mensagem foi enviada.",
        "info",
    )
    return redirect(url_for("index", _anchor="contato"))


@app.errorhandler(404)
def pagina_nao_encontrada(_erro):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)