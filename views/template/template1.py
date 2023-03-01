from flask import Blueprint, render_template
from models import session_scope, User

bp = Blueprint("template1", __name__)


@bp.route('/')
def template1():
    with session_scope() as session:
        test = session.query(User).all()
        test = test.name
    return render_template('/index.html', test=test)