var util = require('util');

module.exports = function Querator() {
    if (!(this instanceof Querator)) {
        return new Querator();
    }

    this.generate = function (data) {
        var aggregateObj = [];

        var parent = data.parent;
        var children = data.children || [];
        var parentKeys = Object.keys(parent.schema.paths);

        var sort = data.sort || [];
        var order = data.order || [];
        var sortObj = {};

        var group = {};
        var group_id = {};
        var groupChildren = {};

        var project = {};
        var i;

        var childrenKeys;
        var childrenName;

        for (var j = 0; j < children.length; j++) {

            childrenKeys = Object.keys(children[j].schema.paths);
            childrenName = children[j].collection.collectionName;

            //unwind
            aggregateObj.push({
                $unwind: {path: '$' + childrenName, preserveNullAndEmptyArrays: true}
            });

            //lookup
            aggregateObj.push({
                $lookup: {from: childrenName, foreignField: '_id', localField: childrenName, as: childrenName}
            });

            //sort
            for (i = 0; i < sort.length; i++) {
                if (sort[i].startsWith(childrenName)) {
                    sortObj[sort[i]] = parseInt(order[i]);
                    aggregateObj.push({$sort: sortObj});
                }
            }

            //project
            for (i = 0; i < parentKeys.length; i++) {
                if (parentKeys[i] === childrenName) {
                    project[parentKeys[i]] = {$arrayElemAt: ['$' + childrenName, 0]};
                    continue;
                } 
                project[parentKeys[i]] = 1;
            }
            aggregateObj.push({$project: project});

            //group
            for (i = 0; i < parentKeys.length; i++) {
                if (parentKeys[i] === childrenName) {
                    continue;
                }
                group_id[parentKeys[i]] = '$' + parentKeys[i];
            }
            for (i = 0; i < childrenKeys.length; i++) {
                groupChildren[childrenKeys[i]] = '$' + childrenName + '.' + childrenKeys[i];
            }
            group._id = group_id;
            group[childrenName] = {$push: groupChildren};
            aggregateObj.push({$group: group});
            
            //project
            project = {};
            for (i = 0; i < parentKeys.length; i++) {
                if (parentKeys[i] === childrenName) {
                    project[parentKeys[i]] = 1;
                    continue;
                }
                project[parentKeys[i]] = '$_id.' + parentKeys[i];
            }
            aggregateObj.push({$project: project});
        }

        //if children array is empty
        !aggregateObj.length ? aggregateObj.push({$match: {}}) : null;

        return aggregateObj;
    };
};
