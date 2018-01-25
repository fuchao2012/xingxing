define([], function () {

    function Battle(name, time,id,child){

        this.name = name;
        this.time = time;
        this.id=id;
        this.child=child;
    }

    return Battle;
});