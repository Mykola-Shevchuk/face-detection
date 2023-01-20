/* Define root DOM element */
const video = document.getElementById('video');

/* Connect to our video camera */
const startVideo = () => {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

Promise.all([
  /* Connect face detector */
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  /* Register facial features */
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  /* Recognize position of the face */
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  /* Recognize emotions of the face  */
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

const handleRecognize = () => {
  const canvas = faceapi.createCanvasFromMedia(video);

  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };

  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100);
};

/* Define video listener */
video.addEventListener('play', handleRecognize);
