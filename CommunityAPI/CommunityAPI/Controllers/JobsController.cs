using CommunityAPI.Models;
using Newtonsoft.Json;
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
    public class JobsController : ApiController
    {
        string _webRoot = "";
        static List<Job> _jobs = null;
        public JobsController()
        {
            _webRoot = HttpContext.Current.Server.MapPath("~/SampleData");
            InitJobData();
        }

        private void InitJobData()
        {
            if (_jobs != null) return;
            _jobs = JsonConvert.DeserializeObject<List<Job>>(File.ReadAllText(Path.Combine(_webRoot, "jobsData.Json")));
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
        [Route("api/Jobs")]
        public HttpResponseMessage GetJobsData()
        {
            var result = Request.CreateResponse(HttpStatusCode.OK, _jobs);
            return result;
        }

        [HttpPost]
        [Route("api/Jobs")]
        public IHttpActionResult PostJob(Job job)
        {
            if (job.Id != Guid.Empty) return BadRequest();
            job.Id = Guid.NewGuid();
            _jobs.Add(job);
            return Ok(job);
        }

        [HttpPut]
        [Route("api/Jobs/{jobId}")]
        public IHttpActionResult PutJob(Guid jobId, Job job)
        {
            if (jobId != job.Id) return BadRequest();
            Job match = null;
            _jobs.ForEach(j => { if (j.Id == jobId) match = j; });
            if (match != null) _jobs.Remove(match);
            _jobs.Add(job);
            return Ok();
        }

        [HttpDelete]
        [Route("api/Jobs/{jobId}")]
        public IHttpActionResult DeleteJob(Guid jobId)
        {
            Job match = null;
            _jobs.ForEach(j => { if (j.Id == jobId) match = j; });
            if (match != null) _jobs.Remove(match);
            return Ok();
        }

        [HttpGet]
        [Route("api/JobTypes")]
        public HttpResponseMessage GetJobsTypes()
        {
            return GetJSONDataFile("jobTypes.json");
        }

        [HttpGet]
        [Route("api/JobSkills")]
        public HttpResponseMessage GetJobSkills()
        {
            return GetJSONDataFile("jobSkills.json");
        }

        [HttpGet]
        [Route("api/States")]
        public HttpResponseMessage GetStates()
        {
            return GetJSONDataFile("states.json");
        }


    }
}
