import { spawn } from 'node:child_process';

function val(server) {

    // If server isn't truthy, (undef/null etc), return before we bother checking.
    if (!server) return false;

    // Check that the coerced type is within expected limits:
    if (server * 1 < 1) return false
    if (server * 1 > 1e6) return false;

    // Return known-safe value:
    return server * 1;
}


// Callback handlers:
function cmd(command, args, opts) {

    // Skip 0 since we don't need it, combine stdout/stderr:
    opts.stdio = ['ignore', 'pipe', 'pipe'];

    return new Promise((resolveFunc) => {
        let p = spawn(command, args, opts);

        let buf = '';

        p.stdout.on("data", (x) => buf += x);
        p.stderr.on("data", (x) => console.error("speedtest-cli: ", x.toString()));

        // We can ignore exit codes, as errors are printed.
        p.on("exit", (code) => {
            resolveFunc({
                stdout: buf.toString(),
                code: code,
                error: null
            });
        });

        p.on("error", e => {
            resolveFunc({
                stdout: buf.toString(),
                code: e,
                error: true
            });
        });
    });
}

/**
 * 
 * @param {number} server
 * @param {number} server
 * @param {boolean} useSingleMode
 */
export async function speedtest(server, exclude, useSingleMode) {



    const args = ["--json", "--secure"];

    if (useSingleMode) args.push('--single');

    let s = null;

    if (s = val(server)) {
        args.push('--server', s);
    }
    if (s = val(exclude)) {
        args.push("--exclude", s);
    }

    const opts = {
        shell: false,
        timeout: 5 * 60_000, // 2 mins
    }

    // Call external speedtest library:
    const r = await cmd('speedtest-cli', args, opts);

    if (process.env.SPEEDTEST_DEBUG == "true"){
	    console.log("DEBUG::", r);
    }

    // Handle syntax errors nicely:
    if (/^ERROR: .*/.test(r.stdout)) {
        const message = (r.stdout).substring(7).replace("\n", '');
        //console.log(message)
        return {
            error: true,
            message
        }
    }

    // Check for abnormal exit:
    if (r.code == null) {
        return {
            error: true,
            message: "Process terminated",
        }
    }

    // Handle unknown, return errors:
    if (r.code !== 0) {
        return {
            error: true,
            message: r.stdout,
        }
    }

    // Handle parsing errors. This occurs AFTER we try and properly decode the error.
    try {
        JSON.parse(r.stdout);
    } catch (e) {
        console.log("Failed to parse:", r)
        return {
            error: true,
            message: "Failed to parse speedtest-cli output",
            data: r.stdout
        };
    }

	const result = JSON.parse(r.stdout);

    // Temporary hack until I decide where to put this logic:
    result.download = ~~(result.download / 1e4) / 1e2;
    result.upload = ~~(result.upload / 1e4) / 1e2;
    result.bytes_recieved = ~~(result.bytes_recieved / 1e4) / 1e2;
    result.bytes_sent = ~~(result.bytes_sent / 1e4) / 1e2;

    // Else we should be fine:
    return {
        error: false,
        ...result
    }
}
