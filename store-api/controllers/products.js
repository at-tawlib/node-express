const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
        name: 'vase table'
    });
    res.status(200).json({ products, nbHits: products.length });
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }

    if (company) {
        queryObject.company = company;
    }

    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }

    // handle numeric filters
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        // use regex to find and replace the appropriate operator
        // numeric filter in the form: "price<40, rating>=4"
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        // change it to this form: "price-$gt-40,rating-$gte-4"
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
        })
    }
    console.log(queryObject);

    let result = Product.find(queryObject);
    // apply sort
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        // if no sort is specified, arrrange according to createdAt
        result = result.sort('createdAt');
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    // get page from query or use page 1
    const page = Number(req.query.page) || 1;
    // get page limit from query or use 10 as default
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}