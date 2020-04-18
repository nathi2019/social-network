const
    path = require('path'),
    { ApiResponse } = require(path.join(__dirname, "..", "..", "util")),
    { Ad, User, Post } = require(path.join(__dirname, '..', '..', 'models')),
    { filterService } = require(path.join(__dirname, '..', 'shared')),
    { notiTypes } = require(path.join(__dirname, '..', '..', 'util'));

function addBadWord(bWord) {
    try {
        let result = filterService.addNewBadWord(bWord);
        return new ApiResponse(200, "success", result);
    } catch (err) {
        console.log("FROM SERVICE.......", err);
    }

}

async function getBadWords() {
    try {
        let result = await filterService.getBadWordList();
        return new ApiResponse(200, "success", result);
    } catch (err) {
        console.log("FROM SERVICE.......", err);
    }

}

function removeBadWord(thisBadWord) {
    filterService.removeBadWord(thisBadWord);
}
/**
 * Update Bad words list 
 * @param {a complete JSON object of bad-words coming from the admin to replace existing one/ mass update} withThisList 
 */
function updateBadWordList(withThisList) {
    try {
        let result = filterService.updateBadWordList(withThisList);
        return new ApiResponse(200, "success", result);
    } catch (err) {
        console.log("FROM SERVICE.......", err);
    }

}
/**
 * A function to review a post to be used by admin 
 * @param {a boolean indicating the decision of the admin} postIsOkay 
 * @param {Id of a user specific to the post} userId 
 * @param {Id of the current post under review } postId 
 */

async function addAdvertisement(advData) {
    const advertisement = new Ad({
        description: advData.description,
        imageUrl: advData.imageUrl,
        postedBy: advData.postedBy,
        minAge: advData.minAge,
        maxAge: advData.maxAge,
        targetType: advData.targetType,
        targetLocation: advData.targetLocation
    });
    let savedAdd = await advertisement.save();
    return savedAdd;
}

async function getAllAdvertisements() {
    let allAdverts = await Ad.aggregate([{ $sort: { createdAt: -1 } }]);
    return allAdverts;
}

async function editAdvertisement(ad_Id, editedAd) {

    return await Ad.updateOne({ _id: ad_Id }, {
        $set: {
            description: editedAd.description,
            imageUrl: editedAd.imageUrl,
            postedBy: editedAd.postedBy,
            minAge: editedAd.minAge,
            maxAge: editedAd.maxAge,
            targetType: editedAd.targetType,
            targetLocation: editedAd.targetLocation

        }
    });

}

async function getAdvertisement(id) {
    return await Ad.findById({ _id: id });

}

async function deleteAd(id) {
    let result = await Ad.findByIdAndRemove({ _id: id });
    return result;
}

async function approveThisPost(thisPost) {
    let result = await Post.findOneAndUpdate({ _id: thisPost._id }, { status: 'okay' });
    return result;
}

async function rejectThisPost(thisPost) {
    let result = await Post.findOneAndUpdate({ _id: thisPost._id }, { status: 'blocked', badPostCount: thisPost.badPostCount + 1 });
    return result;
}

async function activateThisAccount(thisUserAccount) {
    let result = await User.findOneAndUpdate({ _id: thisUserAccount._id }, { status: 'active' });
    return result;
}

async function getDeactivatedAccounts() {
    let results = await User.find({ status: 'blocked' }, { _id: 1, firstname: 1, lastname: 1, email: 1 });
    return results;
}

async function getBadWordedPosts() {
    let results = await User.find({ 'notifications.notiType': { $elematch: { notiType: notiTypes.POST_FLAGGED } } })
        .populate('post')
        .populate('user')
        .execPopuate();
    console.log('BAD WORD NOTIFICATION FETCHED...........', results)


}

module.exports = {
    deleteAd,
    addBadWord,
    getBadWords,
    removeBadWord,
    updateBadWordList,
    addAdvertisement,
    getAdvertisement,
    editAdvertisement,
    deleteAd,
    getAllAdvertisements,
    approveThisPost,
    rejectThisPost,
    activateThisAccount,
    getDeactivatedAccounts,
    getBadWordedPosts
}