import ImagePicker from "react-native-image-picker";


export function selectImage() {
    return new Promise((resolve, reject) => {
        // const options = {
        //     title: 'Select photo',
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images',
        //     },
        // };

        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                reject(response.didCancel)
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                reject(response.error)
            } else if (response.customBton) {
                console.log('User tapped custom button: ', response.customButton);
                reject(response.customButton)
            } else {
                if (response.uri !== null)
                    resolve(response)
                else
                    reject('')
            }
        });
    })
}