/**
 * @author Bryan Brady <bbra0010@student.monash.edu>
 */

/**
 * Represents an event
 * @constructor
 * @param {string} name - The name of the event
 * @param {string} description - The description of the event.
 * @param {datetime} startDate - The Start date of the event.
 * @param {int} isActive - The boolean that checks if event is active or not.
 * @param {string} image - The Image path of the event.
 * @param {int} capacity - The capacity of the event
 * @param {int} ticketsAvailable - The number of available tickets of the event
 * @param {string} categoryId - The category ID this event belongs in
 *
 */
class events {
    constructor(name, description, startDate, duration, isActive, image, capacity, ticketsAvailable, categoryId) {
        this.id = generateId();
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.duration = duration;
        this.isActive = isActive;
        this.image = image;
        this.capacity = capacity;
        this.ticketsAvailable = ticketsAvailable;
        this.categoryId = categoryId;
    }

}

//In order to export the generateId() function, it needs to be outside of event class
/**
 * Function to generates a unique alpha-numeric ID starting with an E followed by 2 random alphabet character then a "-"
 * with lastly 4 random digit numbers
 * @function
 * @returns {string} The generated alpha-numeric ID.
 */
function generateId() {
    let id = "E" + randomChar(2) +  "-" + randomNum();
    return id;
}

//How it works is that similarly to randomNum() we use Math.random * charactersLength  (0, <charactersLength)
//And use math.floor to round up decimal, and charAt to get character at the index characters
/**
 * Function to generate random alphabets based on length
 * @function
 * @param {int} length - The length of alphabets it will generate
 * @return {string} The generated random alphabetical string
 */
function randomChar(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

/**
 * Function to generate a random number between 1000 - 9999
 * @function
 * @return {int} A random number between 1000-9999
 */
function randomNum() {
    // Math.random() generates random decimal between 0 [inclusive] and 1 [exclusive]
    //0 - 0.9999999999999
    const randomDecimal = Math.random();

    //math.floor rounds up decimal
    //Since range is between 1000-9999, there is only 9000 possible choices
    //so, 9999 - 1000 + 1 = 9000
    //right now random decimal would be 0-9000. so since we want 1000 - 9999, add 1000
    const randomNumber = Math.floor(randomDecimal * (9999 - 1000 + 1)) + 1000;

    return randomNumber;
}

module.exports = {
    events,
    generateId,
}
