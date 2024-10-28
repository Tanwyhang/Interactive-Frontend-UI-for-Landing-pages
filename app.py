# app.py
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Homepage setup
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get form data: website name and type
        website_name = request.form['website_name']
        website_type = request.form['website_type']
        return redirect(url_for('generate_website', website_name=website_name, website_type=website_type))

    return render_template('index.html')


# Route to display the generated website
@app.route('/generate/<website_name>/<website_type>')
def generate_website(website_name, website_type):
    # Render the correct template based on the website type selected
    if website_type == 'blog':
        return render_template('blog_template.html', website_name=website_name)
    elif website_type == 'portfolio':
        return render_template('portfolio_template.html', website_name=website_name)
    elif website_type == 'ecommerce':
        return render_template('ecommerce_template.html', website_name=website_name)
    else:
        return "Invalid website type selected!"

if __name__ == '__main__':
    app.run(debug=True)
