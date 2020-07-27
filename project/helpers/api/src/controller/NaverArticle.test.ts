import 'jest'
import app from "../app"
import { Server } from 'http'
import supertest from 'supertest'
import { execPath } from 'process'


describe("Naver Article Tests", () => {
    let server: Server;
    let request: supertest.SuperTest<supertest.Test>;
    beforeAll(async () => {
        server = app.listen(53000, "0.0.0.0")
        request = supertest(server)
    })

    afterAll(() => {
        server.close()
    })

    it("Hello Server", async () => {
        const response = await request.get("/")
        expect(response.status).toBe(200)
    })

    it("올바른 데이터", async () => {
        const response = await request.get("/article?id=4246932")
    })
})
