import React, { useEffect } from "react";
import API from "../../utils/API";
import extAPI from "../../utils/extAPI";



function CreateRouteInfo(props) {
  const { newTrailObj, setNewTrailObj } = props;
  
  //On page load send request to backend for trail distance and update state to render on form
  useEffect(() => {
    async function fetchDistance() {
      const response = await extAPI.getTrailDistance(newTrailObj.origin, newTrailObj.waypoints, newTrailObj.trailType, newTrailObj.destination)
      setNewTrailObj({ ...newTrailObj, length: Math.round(response.data.totalLength * 100)/100 });
    }
    fetchDistance();
  }, [newTrailObj.origin]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewTrailObj({ ...newTrailObj, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const waypointArr = newTrailObj.waypoints.map(wp => {
      return `${wp.lat()}, ${wp.lng()}`
    });

    const trailObj = {
      name: newTrailObj.trailName,
      city: newTrailObj.city,
      state: newTrailObj.state,
      originLat: newTrailObj.origin.lat(),
      originLng: newTrailObj.origin.lng(),
      trailType: newTrailObj.trailType,
      waypoints: waypointArr,
      rating: newTrailObj.rating,
      comments: newTrailObj.comments,
      length: newTrailObj.length
    }

    if (trailObj.trailType === "aToB") {
      trailObj.destination = `${newTrailObj.destination.lat()}, ${newTrailObj.destination.lng()}`;
    }

    API.saveTrail(trailObj)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }
  return (
    <>
      <div>
        <form>
          <label>Trail Name</label><br />
          <input name="trailName" onChange={handleInputChange} value={newTrailObj.trailName} /><br />
          <label>City</label><br />
          <input name="city" onChange={handleInputChange} value={newTrailObj.city} /><br />
          <label>State</label><br />
          <input name="state" onChange={handleInputChange} value={newTrailObj.state} /><br />
          <label>Your Rating 1-5</label><br />
          <input type="number" min="1" max="5" name="rating" onChange={handleInputChange} value={newTrailObj.rating} /><br />
          <label>Length</label><br />
          <input name="length" onChange={handleInputChange} value={newTrailObj.length} /><br />
          <label>Current Condition</label><br />
          <input name="condition" onChange={handleInputChange} placeholder="Well maintained, fallen trees, etc." value={newTrailObj.condition} /><br />
          <label>Comments</label><br />
          <textarea maxLength="500" onChange={handleInputChange} name="comments" value={newTrailObj.comments}></textarea>
          <button onClick={handleSubmit}>Submit Trail</button>
        </form>
      </div>
    </>
  );
}

export default CreateRouteInfo;