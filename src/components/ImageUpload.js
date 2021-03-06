import React, {useState} from 'react'
import { Button, Input } from "@material-ui/core";
import {storage, db} from "../config/firebase"
import firebase from 'firebase';
import './css/ImageUpload.css'


function ImageUpload(username) {
    const [image, setImage] = useState(null);
    // const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            //progress
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message)
            },
            () => {
                //compleate success
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post img into db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageUrl: url,
                            username : username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    };
    return (
        <div className="imageupload">
        <progress value={progress} max="100"/>
            <input
            className="imageupload__progress" 
            type="text" placeholder="Enter a caption..." 
            onChange={event => setCaption(event.target.value)} 
            value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
