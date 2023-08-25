import { TemplateContentEntity } from '@test/entities/templateContent.entity';
import { configRecursiveHtml } from '../templateConfig';
import { TemplateType } from '../../../../src/types/template';

export const contentRecursiveHtmlHead: TemplateContentEntity = {
    name: 'head',
    templateConfigId: configRecursiveHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 10,
    },
    options: {},
    content: `<html><head><title>Recursive Title</title></head><body>`,
};

export const contentRecursiveHtmlBody: TemplateContentEntity = {
    name: 'body',
    templateConfigId: configRecursiveHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 11,
    },
    options: {},
    content: ``,
};

export const contentRecursiveHtmlBodyDivA: TemplateContentEntity = {
    name: 'table',
    templateConfigId: configRecursiveHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 1,
    },
    options: {},
    content: `
    <table>
        <thead>
            <th>
                <% for(const name of data.header) { %>
                    <th><%=name%></th>
                <% } %>
            </th>
        </thead>
        <tbody>
    `,
    templateContent: contentRecursiveHtmlBody,
};
export const contentRecursiveHtmlBodyDivB: TemplateContentEntity = {
    name: 'tbody',
    templateConfigId: configRecursiveHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 2,
    },
    options: {},
    content: `
    <tr>
        <% let user; %>
        <% output.savings = 0; %>
        <% while(user = await data.rows()) { %>
            <% output.savings += user.savings %>
            <td><%=user.id%></td>
            <td><%=user.name%></td>
            <td><%=user.email%></td>
            <td><%=user.birth%></td>
            <td>$ <%=user.savings%></td>
        <% } %>
    </tr>
    `,
    templateContent: contentRecursiveHtmlBody,
};
export const contentRecursiveHtmlBodyDivC: TemplateContentEntity = {
    name: 'tfooter',
    templateConfigId: configRecursiveHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 3,
    },
    options: {},
    content: `
    </tbody>
    <tfoot>
        <tr>
            <td>Total Savings</td>
            <td>$ <%=outputs.tbody.savings%></td>
        </tr>
    </tfoot>
    </table>`,
    templateContent: contentRecursiveHtmlBody,
};

export const contentRecursiveHtmlFooter: TemplateContentEntity = {
    name: 'footer',
    templateConfigId: configRecursiveHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 12,
    },
    options: {},
    content: `</body></html>`,
};
