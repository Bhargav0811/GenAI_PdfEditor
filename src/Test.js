import React from 'react';
import axios from 'axios';
// import fetch from 'node-fetch';

// const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML
import "./css/Test.css"

import { Configuration, OpenAIApi } from 'openai';


class Test extends React.Component {
    state = {
        text: "",
        total_image: 1,
        image_urls: []
    }
    REPLICATE_API_TOKEN = "r8_TAJhalqF6eQTyMhpw3Hao82ZJJqTGkI2Hxp5k"


    query = async (data) => {
        let result;
        const configuration = new Configuration({
            apiKey: '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',
            // apiKey: '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',
            // apiKey: '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',/
        });

        const openai = new OpenAIApi(configuration);
        const response = await openai.createImage({
            prompt: this.state.text,
            n: 1,
            size: "256x256",
        });
        return response.data.data[0].url;
        // const response = await fetch(
        //     "https://api-inference.huggingface.co/models/cloudqi/cqi_text_to_image_pt_v0",
        //     // "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        //     // "https://api-inference.huggingface.co/models/Melonie/text_to_image_finetuned",
        //     {
        //         headers: { Authorization: "Bearer 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" },
        //         method: "POST",
        //         body: JSON.stringify(data),
        //     }
        // );
        // result = await response.blob()
        // return URL.createObjectURL(result)
    }
    


    async getImage(text) {
        // const payload = { "text": text };
        // const genImageApi = "https://api.deepai.org/api/text2img"

        // deepai.setApiKey('23bdefbe-26fd-4c9c-9ef8-af47ea5a6a95');
        for (let i = 0; i < this.state.total_image; i++) {
            try {
                let result;
                    this.query({"inputs": this.state.text+(i+Math.ceil(Math.random()*10)).toString()}).then(async (result) => {
                        console.log(result);

                        let img_url = result;
                        console.log(img_url);
                        let tempImageList = this.state.image_urls
                        tempImageList.push(img_url)
                        this.setState({ image_urls: tempImageList })
                    })
                    

                // const replicate = new Replicate({
                //     auth: this.REPLICATE_API_TOKEN,
                //   });
                  
                // const model = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
                // const input = { prompt: "Birthday cake" };
                // const output = await replicate.run(model, { input });

                // console.log(output);

                // axios.defaults.withCredentials = false
                // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
                // axios.defaults.headers.post['Authorization'] = this.REPLICATE_API_TOKEN;
                // const payload = { "version": "92fa143ccefeed01534d5d6648bd47796ef06847a6bc55c0e5c5b6975f2dcdfb", "input": {"prompt": "Birthday cake"}}
        
    
    
                // axios.post("https://api.replicate.com/v1/predictions", { params: payload }, {
                //     crossDomain: true
                // }).then(response => {
                //     console.log(response);
                //     // console.log(response.data);
                //     // callback(response);
    
                // })
                //     .catch(error => {
                //         console.log(error);
                //     });


                // let replicate = new Replicate({
                //     auth: this.REPLICATE_API_TOKEN,
                //     // fetch: fetch
                // });
                // replicate.fetch()

                // const output = await replicate.run(
                //     "laion-ai/erlich:92fa143ccefeed01534d5d6648bd47796ef06847a6bc55c0e5c5b6975f2dcdfb",
                //     {
                //         input: {
                //             prompt: "Birthday cake"
                //         }
                //     }
                // );

                // let output = await replicate.run(
                //     "pixray/text2image:5c347a4bfa1d4523a58ae614c2194e15f2ae682b57e3797a5bb468920aa70ebf",
                //     {
                //       input: {
                //         prompts: "Birthday cake"
                //       }
                //     }
                //   );
                // console.log(output);
                // var resp = await deepai.callStandardApi("text2img", {
                //     text: this.state.text
                //     // grid_size: 1
                // });
                // console.log(resp);
                // if (resp.output_url) {
                //     let tempImageList = this.state.image_urls
                //     tempImageList.push(resp.output_url)
                //     this.setState({ image_url: tempImageList })
                // }


            } catch (error) {
                console.error(error);
            }
        }

    }

    componentDidMount = () => {
        // this.getImage()
    }

    handleSubmit = (e) => {
        console.log("submitted");
        this.setState({image_urls:[]})
        this.getImage()
        // console.log(this.state);
        e.preventDefault()
    }

    changeNumber = (e) => {
        this.setState({ total_image: parseInt(e.target.value) })
    }

    changeText = (e) => {
        this.setState({ text: e.target.value })
    }
    render() {
        console.log(this.state);
        return (
            <div className='form-group imageGenerator'>
                <form onSubmit={this.handleSubmit}>
                    <input className='form-control' type='number' onChange={this.changeNumber}></input>
                    <input className='form-control' type='text' onChange={this.changeText} placeholder='Enter Query'></input>
                    <button className='btn btn-success'>Submit</button>
                </form>
                <div className='genImageContainer'>
                {
                    (this.state.image_urls.map(imgUrl => {
                        return (
                            <>
                                <img className='genImage' src={imgUrl}></img>
                            </>
                        )
                    }))
                }
                </div>
            </div>
        )
    }
}


export default Test;