using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace CommunityAPI.Controllers
{
    public class EventsController : ApiController
    {
        string _webRoot = "";

        public EventsController()
        {
            _webRoot = HttpContext.Current.Server.MapPath("~/SampleData");
        }

        private HttpResponseMessage GetJSONDataFile(string fileName)
        {
            var path = Path.Combine(_webRoot, fileName);
            var result = Request.CreateResponse(HttpStatusCode.OK);
            var stream = new FileStream(path, FileMode.Open);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            return result;
        }

        [HttpGet]
        [Route("api/Events")]
        public HttpResponseMessage GetEventsData()
        {
            return GetJSONDataFile("eventsData.json");
        }
    }
}
