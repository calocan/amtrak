/**
 * Created by Andy Likuski on 2016.05.26
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/***
 * ArticleContainer is the top-level container component for displaying and article.
 * An article consists of a document from a source (e.g. Google Docs), the
 * schowcase for multimedia that accompanies the document (3D models, images, etc),
 * and a header and footer
 */

import Header from '../components/Header'
import Footer from '../components/Footer'
import Showcase from './Showcase'
import Document from './Document'
import {connect} from 'react-redux';
import React, { Component, PropTypes } from 'react'

class Article extends Component {

    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    /***
     * Fetches the document by url
     */
    componentDidMount() {
    }
    
    render() {
        return <div>
            <Header />
            <Showcase />
            <Document url={this.getUrl()} />
            <Footer />
        </div>;
    }
};

Article.propTypes = {
    document: PropTypes.object.isRequired,
    showcase: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return Map({
        document: state.get('document'),
        showcase: state.get('showcase')
    });
}

export default connect(mapStateToProps)(Article)
