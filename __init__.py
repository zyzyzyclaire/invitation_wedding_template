from flask import Flask

from views.template.template1 import template1

app = Flask(__name__)

app.register_blueprint(template1.bp)