const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
let router = new Router();



const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

router.get('/insertAllGoodsInfo',async(ctx)=>{
    fs.readFile(path.join(__dirname, '../data_json/newgoods.json'),'utf8',(err,data)=>{
        data=JSON.parse(data)
        console.log(typeof data);
        let saveCount=0
        const Goods = mongoose.model('Goods')
        data.map((value,index)=>{
            console.log(value)
            let newGoods = new Goods(value)
            newGoods.save().then(()=>{
                saveCount++
                console.log('成功'+saveCount)
            }).catch(error=>{
                 console.log('失败：'+error)
            })
        })
    })
    ctx.body="开始导入数据"
})

router.get('/insertAllCategory',async(ctx)=>{
    fs.readFile('./data_json/category.json','utf8',(err,data)=>{
        data=JSON.parse(data)
        let saveCount=0
        const Category = mongoose.model('Category')
        data.RECORDS.map((value,index)=>{
            console.log(value)
            let newCategory = new Category(value)
            newCategory.save().then(()=>{
                saveCount++
                console.log('成功'+saveCount)
            }).catch(error=>{
                 console.log('失败：'+error)
            })
        })
    })
    ctx.body="开始导入数据"
})

router.get('/insertAllCategorySub',async(ctx)=>{
    fs.readFile('./data_json/category_sub.json','utf8',(err,data)=>{
        data = JSON.parse(data)
        let saveCount = 0 
        const CategorySub = mongoose.model('CategorySub')
        data.RECORDS.map((value,index)=>{
            console.log(value)
            let newCategorySub = new CategorySub(value)
            newCategorySub.save().then(()=>{
                saveCount++
                console.log('成功插入'+saveCount)
            }).catch(error=>{
                console.log('插入失败:'+error)
            })
        }) 
    })
    ctx.body="开始导入数据..."
})

/**
 * 获取商品详情信息借口
 */
router.post("/getDetailGoodsInfo",async(ctx)=>{
    try {
        let goodsId = ctx.request.body.goodsId
        const Goods = mongoose.model('Goods')
        console.log(goodsId);
        let result= await Goods.findOne({ID:goodsId}).exec()
        ctx.body={code:200,message:result}
    } catch (error) {
        ctx.body={code:500,message:error}
    }
})

/**
 * 获取商品大类
 */
router.get('/getCategoryList',async (ctx)=>{
    try {
        const Category = mongoose.model('Category')
        let result = await Category.find().exec()
        ctx.body = {
            code:200,
            message:result
        }
    } catch (error) {
        ctx.body = {
            code:500,
            message:error
        }
    }
})

/**
 * 获取子分类
 */
router.post('/getCategorySubList',async (ctx)=>{
    try {
        let categoryId = ctx.request.body.categoryId
        const CategorySub  = mongoose.model('CategorySub')
        let result = await CategorySub.find({MALL_CATEGORY_ID:categoryId}).exec()
        ctx.body={code:200,message:result}
    } catch (error) {
        ctx.body = {
            code:500,
            message:error
        }
    }
})
/**
 * 根据类别获取商品列表
 */
router.post('/getGoodsListByCategorySubID',async(ctx)=>{
    try {
        let categorySubId = ctx.request.body.categorySubId //小类别
        let page =ctx.request.body.page
        let num = 10 //每页显示数量
        let start = (page-1)*num

        const Goods = mongoose.model('Goods')
        let result = await Goods.find({SUB_ID:categorySubId}).skip(start).limit(num).exec()
        ctx.body={code:200,message:result}
    } catch (error) {
        ctx.body={code:500,message:error}
    }
})


module.exports = router
