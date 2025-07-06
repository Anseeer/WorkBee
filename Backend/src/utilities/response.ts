
export class successResponse <T>{
    constructor(public status:number, public message:string, public data:T){
       
    }
}

export class errorResponse <T>{
    constructor(public status:number, public message:string, public data:T){
       
    }
}